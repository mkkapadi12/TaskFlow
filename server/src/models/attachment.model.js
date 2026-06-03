import callProcedure from '../config/callProcedure.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/error.middleware.js';
import { requireManager, requireMembership } from '../utils/requireRole.js';
import { uploadDocToCloudinary } from '../utils/uploadToCloudinary.js';

const AttachmentModel = {
  upload: async (taskId, uploadedBy, files) => {
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // 1. Get task to find the project it belongs to
    const [taskRows] = await callProcedure('sp_GetTaskById', [taskId]);
    const task = taskRows[0];
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // 2. Enforce only task assignee can upload task attachments
    if (!task.assigneeId || Number(task.assigneeId) !== Number(uploadedBy)) {
      throw new AppError(
        'Only the assignee of the task can upload attachments',
        403
      );
    }

    const uploaded = [];

    for (const file of files) {
      // 3. Upload to Cloudinary
      const result = await uploadDocToCloudinary(
        file.buffer,
        file.originalname,
        'my_database/task_attachments'
      );

      // 4. Save metadata in DB
      const [rows] = await callProcedure('sp_CreateTaskAttachment', [
        taskId,
        uploadedBy,
        file.originalname,
        result.secure_url,
        result.public_id,
        file.size,
        file.mimetype,
      ]);

      uploaded.push(rows[0]);
    }

    return uploaded;
  },

  getByTask: async (taskId, userId) => {
    // 1. Get task to find the project it belongs to
    const [taskRows] = await callProcedure('sp_GetTaskById', [taskId]);
    const task = taskRows[0];
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // 2. Check task's project membership
    await requireMembership(task.projectId, userId);

    // 3. Fetch from DB
    const [attachments] = await callProcedure('sp_GetTaskAttachments', [
      taskId,
    ]);
    return attachments;
  },

  delete: async (attachmentId, userId) => {
    // 1. Get attachment metadata
    const [rows] = await callProcedure('sp_GetTaskAttachmentById', [
      attachmentId,
    ]);
    const attachment = rows[0];
    if (!attachment) {
      throw new AppError('Attachment not found', 404);
    }

    // 2. Get task to find the project it belongs to
    const [taskRows] = await callProcedure('sp_GetTaskById', [
      attachment.taskId,
    ]);
    const task = taskRows[0];
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // 3. Check authorization: must be uploader OR OWNER/ADMIN (manager) of project
    const isUploader = attachment.uploadedBy === userId;
    let isManager = false;
    try {
      await requireManager(task.projectId, userId);
      isManager = true;
    } catch {
      // Not a manager
    }

    if (!isUploader && !isManager) {
      throw new AppError(
        'Only the uploader or a project manager can delete this attachment',
        403
      );
    }

    // 4. Delete from Cloudinary
    await cloudinary.v2.uploader.destroy(attachment.publicId, {
      resource_type: 'raw',
    });

    // 5. Delete from DB
    const [result] = await callProcedure('sp_DeleteTaskAttachment', [
      attachmentId,
    ]);
    if (result[0]?.deletedCount === 0) {
      throw new AppError('Failed to delete attachment', 500);
    }

    return { message: 'Attachment deleted successfully' };
  },
};

export default AttachmentModel;

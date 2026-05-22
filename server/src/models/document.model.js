import callProcedure from '../config/callProcedure.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/error.middleware.js';
import { requireManager, requireMembership } from '../utils/requireRole.js';
import { uploadDocToCloudinary } from '../utils/uploadToCloudinary.js';

const DocumentModel = {
  upload: async (projectId, uploadedBy, files) => {
    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const [rows] = await callProcedure('sp_getProjectById', [projectId]);

    const existProject = rows[0];

    if (!existProject) throw new AppError('Project not found', 404);

    await requireManager(existProject.id, uploadedBy);

    const uploaded = [];

    for (const file of files) {
      const result = await uploadDocToCloudinary(
        file.buffer,
        file.originalname
      );

      const [rows] = await callProcedure('sp_CreateProjectDocument', [
        projectId,
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

  // Get all docs for project (membership required)
  getByProject: async ({ projectId, userId }) => {
    const [row] = await callProcedure('sp_GetProjectById', [projectId]);

    const existProject = row[0];

    if (!existProject) throw new AppError('Project not found', 404);

    await requireMembership(projectId, userId);

    const [docs] = await callProcedure('sp_GetProjectDocuments', [projectId]);
    return docs;
  },

  // Delete single doc (admin OR owner only)
  delete: async (documentId, userId, projectId) => {
    // auth: must be admin OR owner of that project
    await requireManager(projectId, userId);

    const [rows] = await callProcedure('sp_GetProjectDocumentById', [
      documentId,
    ]);
    const doc = rows[0];

    if (!doc) throw new AppError('Document not found', 404);

    if (projectId !== doc.projectId) {
      throw new AppError('Invalid project id', 400);
    }

    // delete from Cloudinary first
    await cloudinary.v2.uploader.destroy(doc.publicId, {
      resource_type: 'raw',
    });

    // // delete from DB
    await callProcedure('sp_DeleteProjectDocument', [documentId]);

    return { message: 'Document deleted successfully' };
  },
};

export default DocumentModel;

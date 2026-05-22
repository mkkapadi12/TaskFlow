import callProcedure from '../config/callProcedure.js';
import cloudinary from '../config/cloudinary.js';
import { AppError } from '../middlewares/error.middleware.js';
import { requireManager } from '../utils/requireRole.js';
import { uploadDocToCloudinary } from '../utils/uploadToCloudinary.js';

const DocumentModel = {
  upload: async (projectId, uploadedBy, files) => {
    await requireManager(projectId, uploadedBy);

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
  getByProject: async (projectId) => {
    const [docs] = await callProcedure('sp_GetProjectDocuments', [projectId]);
    return docs;
  },

  // Delete single doc (manager only)
  delete: async (documentId, userId) => {
    const [rows] = await callProcedure('sp_GetProjectDocumentById', [
      documentId,
    ]);
    const doc = rows[0];

    if (!doc) throw new AppError('Document not found', 404);

    // auth: must be manager of that project
    await requireManager(doc.projectId, userId);

    // delete from Cloudinary first
    await cloudinary.v2.uploader.destroy(doc.publicId, {
      resource_type: 'raw',
    });

    // delete from DB
    await callProcedure('sp_DeleteProjectDocument', [documentId]);

    return { message: 'Document deleted successfully' };
  },
};

export default DocumentModel;

import DocumentModel from '../models/document.model.js';
import { requireMembership } from '../utils/requireRole.js';

const uploadDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const docs = await DocumentModel.upload(
      Number(req.params.projectId),
      req.user.id,
      req.files
    );

    res.status(201).json({
      success: true,
      message: `${docs.length} document(s) uploaded successfully`,
      data: docs,
    });
  } catch (err) {
    next(err);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    // membership check before exposing docs
    await requireMembership(Number(req.params.projectId), req.user.id);

    const docs = await DocumentModel.getByProject(Number(req.params.projectId));

    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await DocumentModel.delete(
      Number(req.params.documentId),
      req.user.id
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

export { deleteDocument, getDocuments, uploadDocuments };

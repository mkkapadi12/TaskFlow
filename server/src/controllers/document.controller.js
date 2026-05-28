import DocumentModel from '../models/document.model.js';

const uploadDocuments = async (req, res, next) => {
  try {
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
    const projectId = req.params.projectId;
    let docs;
    if (projectId) {
      docs = await DocumentModel.getByProject({
        projectId: Number(projectId),
        userId: req.user.id,
      });
    } else {
      docs = await DocumentModel.getAllUserDocs(req.user.id);
    }

    res.status(200).json({ success: true, data: docs });
  } catch (err) {
    next(err);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    const result = await DocumentModel.delete(
      Number(req.params.documentId),
      req.user.id,
      Number(req.params.projectId)
    );
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
};

export { deleteDocument, getDocuments, uploadDocuments };

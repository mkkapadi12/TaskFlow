import AttachmentModel from '../models/attachment.model.js';

export const uploadAttachments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const files = req.files;

    const data = await AttachmentModel.upload(Number(taskId), userId, files);

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskAttachments = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const data = await AttachmentModel.getByTask(Number(taskId), userId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAttachment = async (req, res, next) => {
  try {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const result = await AttachmentModel.delete(Number(attachmentId), userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

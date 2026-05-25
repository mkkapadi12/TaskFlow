import CommentModel from '../models/comment.model.js';

const createComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.create(
      Number(req.params.taskId),
      req.user.id,
      req.body.content
    );
    res.status(201).json({
      success: true,
      message: 'Comment added',
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  try {
    const comments = await CommentModel.getByTask(
      Number(req.params.taskId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const result = await CommentModel.delete(
      Number(req.params.commentId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export { createComment, deleteComment, getComments };

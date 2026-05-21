import TaskModel from '../models/task.model.js';

const createTask = async (req, res, next) => {
  try {
    const task = await TaskModel.create(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await TaskModel.getByProject(
      Number(req.params.projectId),
      req.user.id,
      req.query.status || null
    );
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.getMyTasks(req.user.id);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskModel.getById(
      Number(req.params.taskId),
      req.user.id
    );
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await TaskModel.update(
      Number(req.params.taskId),
      req.user.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const result = await TaskModel.delete(
      Number(req.params.taskId),
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

const getOverdueTasks = async (req, res, next) => {
  try {
    const tasks = await TaskModel.getOverdue(req.user.id);
    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await TaskModel.updateStatus(
      Number(req.params.taskId),
      req.user.id,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: 'Task status updated',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

const verifyTask = async (req, res, next) => {
  try {
    const task = await TaskModel.verify(
      Number(req.params.taskId),
      req.user.id,
      Boolean(req.body.approve)
    );
    res.status(200).json({
      success: true,
      message: req.body.approve
        ? 'Task approved and marked DONE'
        : 'Task sent back for changes',
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createTask,
  deleteTask,
  getMyTasks,
  getOverdueTasks,
  getTaskById,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  verifyTask,
};

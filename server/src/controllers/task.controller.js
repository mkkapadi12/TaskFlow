import TaskModel from '../models/task.model.js';
import notificationDispatcher from '../services/notificationDispatcher.service.js';

const createTask = async (req, res, next) => {
  try {
    const task = await TaskModel.create(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });

    // Fire-and-forget notification dispatch
    if (task && task.assigneeId) {
      notificationDispatcher.dispatch('TASK_ASSIGNED', {
        actorId: req.user.id,
        actorName: req.user.name,
        taskId: task.id,
        assigneeId: task.assigneeId,
      });
    }
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
    const { search, priority, startDate, endDate } = req.query;
    const tasks = await TaskModel.getMyTasks(
      req.user.id,
      search || null,
      priority || null,
      startDate || null,
      endDate || null
    );
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
    const taskId = Number(req.params.taskId);
    // Fetch before updating to check for assignee changes
    const originalTask = await TaskModel.getById(taskId, req.user.id);

    const task = await TaskModel.update(taskId, req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });

    // Fire-and-forget notification dispatch
    if (
      task &&
      task.assigneeId &&
      task.assigneeId !== originalTask.assigneeId
    ) {
      notificationDispatcher.dispatch('TASK_ASSIGNED', {
        actorId: req.user.id,
        actorName: req.user.name,
        taskId: task.id,
        assigneeId: task.assigneeId,
      });
    }
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
    const taskId = Number(req.params.taskId);
    // Fetch before updating to check for status changes
    const originalTask = await TaskModel.getById(taskId, req.user.id);

    const task = await TaskModel.updateStatus(
      taskId,
      req.user.id,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: 'Task status updated',
      data: task,
    });

    // Fire-and-forget notification dispatch
    if (task && task.status !== originalTask.status) {
      notificationDispatcher.dispatch('TASK_STATUS_CHANGED', {
        actorId: req.user.id,
        actorName: req.user.name,
        taskId: task.id,
        oldStatus: originalTask.status,
        newStatus: task.status,
      });
    }
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

    // Fire-and-forget notification dispatch
    if (task) {
      notificationDispatcher.dispatch('TASK_VERIFIED', {
        actorId: req.user.id,
        actorName: req.user.name,
        taskId: task.id,
        approved: Boolean(req.body.approve),
      });
    }
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

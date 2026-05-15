import ProjectModel from "../models/project.model.js";

const createProject = async (req, res, next) => {
  try {
    const project = await ProjectModel.create(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.findAll();
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await ProjectModel.getProjectDetailsById(
      Number(req.params.projectId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await ProjectModel.update(
      Number(req.params.projectId),
      req.user.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const result = await ProjectModel.delete(
      Number(req.params.id),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (err) {
    next(err);
  }
};

const getMembers = async (req, res, next) => {
  try {
    const members = await ProjectModel.getMembers(
      Number(req.params.projectId),
      req.user.id,
    );
    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    const member = await ProjectModel.addMember(
      Number(req.params.projectId),
      req.user.id,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

const updateMemberRole = async (req, res, next) => {
  try {
    const member = await ProjectModel.updateMemberRole(
      Number(req.params.projectId),
      req.user.id,
      Number(req.params.userId),
      req.body.role,
    );
    res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const result = await ProjectModel.removeMember(
      Number(req.params.projectId),
      req.user.id,
      Number(req.params.userId),
    );
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

// Get projects the logged-in user is a member of
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.getByMember(req.user.id);
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

// Get projects owned by a specific user (admin)
const getProjectsByOwner = async (req, res, next) => {
  try {
    const projects = await ProjectModel.getByOwner(
      Number(req.params.ownerId),
    );
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  getMembers,
  addProjectMember,
  updateMemberRole,
  removeMember,
  getMyProjects,
  getProjectsByOwner,
};

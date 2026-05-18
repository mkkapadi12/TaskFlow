import callProcedure from "../config/callProcedure.js";
import { AppError } from "../middlewares/error.middleware.js";
import { requireMembership, requireOwner } from "../utils/requireRole.js";

const ProjectModel = {
  create: async (ownerId, body) => {
    const { title, description } = body;

    const [project] = await callProcedure("sp_CreateProject", [
      title,
      description,
      ownerId,
    ]);
    return project[0];
  },

  // Delete a project (only owner)
  delete: async (projectId, ownerId) => {
    await requireOwner(projectId, ownerId);
    const [result] = await callProcedure("sp_DeleteProject", [projectId]);

    return result[0];
  },

  // get all projects
  findAll: async () => {
    const [projects] = await callProcedure("sp_GetAllProjects");
    return projects;
  },

  // get project by id with members and tasks (3 result sets)
  getProjectDetailsById: async (projectId, userId) => {
    await requireMembership(projectId, userId);

    // sp_GetFullProjectDetails returns 3 result sets:
    //   [0] → project row   [1] → members[]   [2] → tasks[]
    const [projectRows, memberRows, taskRows] = await callProcedure(
      "sp_GetFullProjectDetails",
      [projectId],
    );

    if (!projectRows || !projectRows[0]) {
      throw new AppError("Project not found", 404);
    }

    return {
      ...projectRows[0],
      members: memberRows ?? [],
      tasks: taskRows ?? [],
    };
  },

  addMember: async (projectId, ownerId, body) => {
    await requireOwner(projectId, ownerId);
    const [result] = await callProcedure("sp_AddProjectMember", [
      projectId,
      body.userId,
      body.role,
    ]);
    return result[0];
  },

  // Update project (only owner)
  update: async (projectId, ownerId, body) => {
    await requireOwner(projectId, ownerId);
    const { title, description, status } = body;
    const [result] = await callProcedure("sp_UpdateProject", [
      projectId,
      title ?? null,
      description ?? null,
      status ?? null,
    ]);
    return result[0];
  },

  // Get projects owned by a specific user
  getByOwner: async (ownerId) => {
    const [projects] = await callProcedure("sp_GetProjectsByOwner", [ownerId]);
    return projects;
  },

  // Get projects where user is a member
  getByMember: async (userId) => {
    const [projects] = await callProcedure("sp_GetProjectsByMember", [userId]);
    return projects;
  },

  // Get members of a project (requires membership)
  getMembers: async (projectId, userId) => {
    await requireMembership(projectId, userId);
    const [members] = await callProcedure("sp_GetProjectMembers", [projectId]);
    return members;
  },

  // Update a member's role (only owner)
  updateMemberRole: async (projectId, ownerId, targetUserId, role) => {
    await requireOwner(projectId, ownerId);
    const [result] = await callProcedure("sp_UpdateMemberRole", [
      projectId,
      targetUserId,
      role,
    ]);
    return result[0];
  },

  // Remove a member from project (only owner)
  removeMember: async (projectId, ownerId, targetUserId) => {
    await requireOwner(projectId, ownerId);
    const [result] = await callProcedure("sp_RemoveProjectMember", [
      projectId,
      targetUserId,
    ]);
    if (result[0]?.deletedCount === 0) {
      throw new AppError("Member not found in project", 404);
    }
    return { message: "Member removed successfully" };
  },
};

export default ProjectModel;

import callProcedure from "../config/callProcedure.js";
import { AppError } from "../middlewares/error.middleware.js";

// Helper: check if a user is a member of a project and return their role
const getMembership = async (projectId, userId) => {
  const [project] = await callProcedure("sp_GetMemberRole", [
    projectId,
    userId,
  ]);
  return project[0];
};

// Helper: require membership, throw 403 if not a member
const requireMembership = async (projectId, userId) => {
  const membership = await getMembership(projectId, userId);
  if (!membership) {
    throw new AppError("You are not a member of this project", 403);
  }
  return membership;
};

// Helper: require owner or admin role
const requireOwner = async (projectId, userId) => {
  const membership = await requireMembership(projectId, userId);
  if (membership.role !== "OWNER") {
    throw new AppError("Only project owner can perform this action", 403);
  }
  return membership;
};

export { getMembership, requireMembership, requireOwner };

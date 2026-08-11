import { createTeam, getAllTeams, getMyTeam, getTeamById, getTeamMembers, resolveTeamMember, resolveTeamMemberIdentifier, addMember, removeMember, updateTeam, deleteTeam } from "./team.service.js";
import { success, error } from "../../utils/response.js";
import { ROLES } from "../auth/auth.model.js";

export const createTeamController = async (req, res, next) => {
  try {
    const team = await createTeam(req.body, req.user.userId);
    success(res, team, "Team created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllTeamsController = async (req, res, next) => {
  try {
    const teams = await getAllTeams(req.validatedQuery);
    return success(res, teams);
  } catch (err) {
    next(err);
  }
};

export const getTeamByIdController = async (req, res, next) => {
  try {
    const team = await getTeamById(req.params.id);
    if (!team) return error(res, "Team not found", 404);
    if (req.user.role === ROLES.STUDENT && !team.members.some((member) => member._id.toString() === req.user.userId)) {
      return error(res, "Access denied", 403);
    }
    if (req.user.role === ROLES.STUDENT) {
      const studentTeam = team.toObject();
      delete studentTeam.createdBy;
      return success(res, studentTeam);
    }
    return success(res, team);
  } catch (err) {
    next(err);
  }
};

export const addMemberController = async (req, res, next) => {
  try {
    const memberId = await resolveTeamMember(req.body);
    const team = await addMember(req.params.id, memberId);
    if (!team) return error(res, "Team not found", 404);
    return success(res, team, "Member added");
  } catch (err) {
    next(err);
  }
};

export const getMyTeamController = async (req, res, next) => {
  try {
    const team = await getMyTeam(req.user.userId);
    if (!team) return error(res, "Team not found", 404);
    return success(res, team);
  } catch (err) {
    next(err);
  }
};

export const getTeamMembersController = async (req, res, next) => {
  try {
    const team = await getTeamMembers(req.params.id);
    if (!team) return error(res, "Team not found", 404);
    if (req.user.role === ROLES.STUDENT && !team.members.some((member) => member._id.toString() === req.user.userId)) {
      return error(res, "Access denied", 403);
    }
    return success(res, team.members);
  } catch (err) {
    next(err);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const memberId = await resolveTeamMemberIdentifier(req.params.memberId);
    const team = await removeMember(req.params.id, memberId);
    if (!team) return error(res, "Team not found", 404);
    return success(res, team, "Member removed");
  } catch (err) {
    next(err);
  }
};

export const updateTeamController = async (req, res, next) => {
  try {
    const team = await updateTeam(req.params.id, req.body);
    if (!team) return error(res, "Team not found", 404);
    return success(res, team, "Team updated");
  } catch (err) {
    next(err);
  }
};

export const deleteTeamController = async (req, res, next) => {
  try {
    const team = await deleteTeam(req.params.id);
    if (!team) return error(res, "Team not found", 404);
    return success(res, null, "Team deleted");
  } catch (err) {
    next(err);
  }
};

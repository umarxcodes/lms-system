import { createTeam, getAllTeams, getTeamById, addMember, removeMember, updateTeam, deleteTeam } from "./team.service.js";
import { success, error } from "../../utils/response.js";

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
    const teams = await getAllTeams();
    success(res, teams);
  } catch (err) {
    next(err);
  }
};

export const getTeamByIdController = async (req, res, next) => {
  try {
    const team = await getTeamById(req.params.id);
    if (!team) return error(res, "Team not found", 404);
    success(res, team);
  } catch (err) {
    next(err);
  }
};

export const addMemberController = async (req, res, next) => {
  try {
    const team = await addMember(req.params.id, req.body.memberId);
    if (!team) return error(res, "Team not found", 404);
    return success(res, team, "Member added");
  } catch (err) {
    next(err);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const team = await removeMember(req.params.id, req.params.memberId);
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

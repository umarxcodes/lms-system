import { createTeam, getAllTeams, getTeamById, addMember, removeMember } from "./team.service.js";
import { success, error } from "../../utils/response.js";

export const createTeamController = async (req, res, next) => {
  try {
    const team = await createTeam(req.body);
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
    success(res, team, "Member added");
  } catch (err) {
    next(err);
  }
};

export const removeMemberController = async (req, res, next) => {
  try {
    const team = await removeMember(req.params.id, req.params.memberId);
    success(res, team, "Member removed");
  } catch (err) {
    next(err);
  }
};

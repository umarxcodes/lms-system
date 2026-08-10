import Team from "./team.model.js";

export const createTeam = async (data) => {
  return await Team.create(data);
};

export const getAllTeams = async () => {
  return await Team.find().populate("createdBy", "name email").populate("members", "name email");
};

export const getTeamById = async (id) => {
  return await Team.findById(id).populate("createdBy", "name email").populate("members", "name email");
};

export const addMember = async (id, memberId) => {
  return await Team.findByIdAndUpdate(id, { $addToSet: { members: memberId } }, { new: true }).populate("members", "name email");
};

export const removeMember = async (id, memberId) => {
  return await Team.findByIdAndUpdate(id, { $pull: { members: memberId } }, { new: true }).populate("members", "name email");
};

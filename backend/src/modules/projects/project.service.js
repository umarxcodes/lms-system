import Project from "./project.model.js";
import Team from "../teams/team.model.js";
import Task from "../tasks/task.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { createNotifications } from "../notifications/notification.service.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

// notifyProjectTeam sends a notification to every Student in the Team that
// owns the given Project. This keeps team members informed about changes
// without requiring them to poll the API.
async function notifyProjectTeam(project, title, message) {
  const teamId = project.team?._id || project.team;
  const team = await Team.findById(teamId).select("members");
  if (!team?.members.length) return;
  await createNotifications({
    recipientIds: team.members,
    type: "PROJECT",
    title,
    message,
    relatedEntity: "Project",
    relatedEntityId: project._id
  });
}

// createProject enforces the business rule that each Team can own only one
// Project. The unique index on the team field provides database-level
// protection; the service-level check produces a cleaner API error.
export const createProject = async ({ teamId, ...data }) => {
  assertObjectId(teamId, "Team id");
  if (!await Team.exists({ _id: teamId })) throw appError("Team not found", 404);
  if (await Project.exists({ team: teamId })) {
    throw appError("This team already has a project", 409);
  }
  const project = await Project.create({ ...data, team: teamId });
  await notifyProjectTeam(project, "New project assigned", `Your Team has been assigned the project: ${project.title}.`);
  return project;
};

export const getAllProjects = async () => {
  return await Project.find().populate("team", "name");
};

export const getProjectById = async (id) => {
  assertObjectId(id, "Project id");
  return await Project.findById(id).populate("team", "name");
};

// getMyProjects resolves the Student's Team from their membership and returns
// all Projects for that Team. Students never see Projects from Teams they do
// not belong to.
export const getMyProjects = async (userId) => {
  assertObjectId(userId, "User id");
  const team = await Team.findOne({ members: userId }).select("_id");
  if (!team) throw appError("You are not assigned to a team", 404);

  return Project.find({ team: team._id }).populate("team", "name");
};

// userOwnsProject checks whether a User is a member of the Project's Team.
// This is the authorization gate for Student access to individual Projects.
export const userOwnsProject = async (project, userId) => {
  assertObjectId(userId, "User id");
  const teamId = project.team?._id || project.team;
  return Boolean(teamId && await Team.exists({ _id: teamId, members: userId }));
};

export const updateProjectStatus = async (id, status) => {
  assertObjectId(id, "Project id");
  const project = await Project.findByIdAndUpdate(id, { status }, { returnDocument: "after", runValidators: true }).populate("team", "name");
  if (project) await notifyProjectTeam(project, "Project status updated", `The status of ${project.title} is now ${project.status}.`);
  return project;
};

export const updateProject = async (id, data) => {
  assertObjectId(id, "Project id");
  const project = await Project.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).populate("team", "name");
  if (project) await notifyProjectTeam(project, "Project updated", `Project details for ${project.title} were updated.`);
  return project;
};

// deleteProject blocks deletion while Tasks still reference the Project.
// This prevents orphaned Task records and preserves work history.
export const deleteProject = async (id) => {
  assertObjectId(id, "Project id");
  if (await Task.exists({ project: id })) throw appError("Project cannot be deleted while it has tasks", 409);
  return Project.findByIdAndDelete(id);
};

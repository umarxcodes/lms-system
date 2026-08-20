import Project from "./project.model.js";
import Team from "../teams/team.model.js";
import Task from "../tasks/task.model.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { createNotifications } from "../notifications/notification.service.js";

function assertObjectId(id, label = "Id") {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

// Helper to calculate and attach real-time task progress metrics to projects
async function attachTaskStatsToProjects(projects) {
  if (!projects) return projects;
  const isArray = Array.isArray(projects);
  const list = isArray ? projects : [projects];
  if (!list.length) return projects;

  const projectIds = list.map((p) => p._id);
  const taskStats = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: "$project",
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } }
      }
    }
  ]);

  const statsMap = new Map();
  taskStats.forEach((s) => {
    statsMap.set(s._id.toString(), s);
  });

  const result = list.map((pDoc) => {
    const p = pDoc.toObject ? pDoc.toObject() : { ...pDoc };
    const stat = statsMap.get(p._id.toString());
    const total = stat ? stat.total : 0;
    const completed = stat ? stat.completed : 0;
    let progress = 0;
    if (total > 0) {
      progress = Math.round((completed / total) * 100);
    } else if (p.status === "completed") {
      progress = 100;
    }
    p.progress = progress;
    p.taskCount = total;
    p.completedTaskCount = completed;
    return p;
  });

  return isArray ? result : result[0];
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
  const created = await Project.create({ ...data, team: teamId });
  const project = await Project.findById(created._id).populate("team", "name");
  await notifyProjectTeam(project, "New project assigned", `Your Team has been assigned the project: ${project.title}.`);
  return await attachTaskStatsToProjects(project);
};

export const getAllProjects = async () => {
  const projects = await Project.find().populate("team", "name");
  return await attachTaskStatsToProjects(projects);
};

export const getProjectById = async (id) => {
  assertObjectId(id, "Project id");
  const project = await Project.findById(id).populate("team", "name");
  if (!project) return null;
  return await attachTaskStatsToProjects(project);
};

// getMyProjects resolves the Student's Team from their membership and returns
// all Projects for that Team. Students never see Projects from Teams they do
// not belong to.
export const getMyProjects = async (userId) => {
  assertObjectId(userId, "User id");
  const team = await Team.findOne({ members: userId }).select("_id");
  if (!team) throw appError("You are not assigned to a team", 404);

  const projects = await Project.find({ team: team._id }).populate("team", "name");
  return await attachTaskStatsToProjects(projects);
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
  return await attachTaskStatsToProjects(project);
};

export const updateProject = async (id, data) => {
  assertObjectId(id, "Project id");
  const updateData = { ...data };
  if (updateData.teamId) {
    updateData.team = updateData.teamId;
    delete updateData.teamId;
  }
  const project = await Project.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true }).populate("team", "name");
  if (project) await notifyProjectTeam(project, "Project updated", `Project details for ${project.title} were updated.`);
  return await attachTaskStatsToProjects(project);
};

// deleteProject blocks deletion while Tasks still reference the Project.
// This prevents orphaned Task records and preserves work history.
export const deleteProject = async (id) => {
  assertObjectId(id, "Project id");
  if (await Task.exists({ project: id })) throw appError("Project cannot be deleted while it has tasks", 409);
  return Project.findByIdAndDelete(id);
};

import User from "../modules/auth/auth.model.js";
import Attendance from "../modules/attendance/attendance.model.js";
import Team from "../modules/teams/team.model.js";
import Project from "../modules/projects/project.model.js";
import Task from "../modules/tasks/task.model.js";

export async function getDashboardStats() {
  const students = await User.countDocuments({ role: "student" });
  const attendanceRecords = await Attendance.countDocuments();
  const teams = await Team.countDocuments();
  const projects = await Project.countDocuments();
  const tasks = await Task.countDocuments();
  return { students, attendanceRecords, teams, projects, tasks };
}

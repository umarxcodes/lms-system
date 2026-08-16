import { getAuthenticatedStudent } from "./student.service.js";
import { getMyAttendance } from "../attendance/attendance.service.js";
import { getMyTeam } from "../teams/team.service.js";
import { getMyProjects } from "../projects/project.service.js";
import { getMyTasks, getMyAssignedTasks } from "../tasks/task.service.js";
import { appError } from "../../utils/appError.js";

function summarizeAttendance(records) {
  return records.reduce((summary, record) => {
    summary.total += 1;
    summary[record.status] = (summary[record.status] || 0) + 1;
    return summary;
  }, { total: 0, present: 0, absent: 0, leave: 0, late: 0 });
}

export const getStudentDashboard = async (userId) => {
  const [profile, attendanceRecords, team, projects, tasks, assignedTasks] = await Promise.all([
    getAuthenticatedStudent(userId),
    getMyAttendance(userId).catch(() => []),
    getMyTeam(userId).catch(() => null),
    getMyProjects(userId).catch(() => []),
    getMyTasks(userId).catch(() => []),
    getMyAssignedTasks(userId).catch(() => [])
  ]);

  if (!profile) throw appError("Student profile not found", 404);

  return {
    profile,
    attendance: summarizeAttendance(attendanceRecords || []),
    team: team || null,
    projects: projects || [],
    tasks: tasks || [],
    assignedTasks: assignedTasks || []
  };
};

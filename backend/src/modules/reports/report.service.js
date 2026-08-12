import mongoose from "mongoose";
import Student from "../students/student.model.js";
import Team from "../teams/team.model.js";
import Project from "../projects/project.model.js";
import Task from "../tasks/task.model.js";
import { getAttendance, getAttendanceByStudent } from "../attendance/attendance.service.js";
import { appError } from "../../utils/appError.js";

function assertObjectId(id, label) {
  if (!mongoose.isValidObjectId(id)) throw appError(`${label} is invalid`, 400);
}

function countAttendance(records) {
  return records.reduce((summary, record) => {
    summary.total += 1;
    summary[record.status] += 1;
    return summary;
  }, { total: 0, present: 0, absent: 0, leave: 0, late: 0 });
}

function countTasks(tasks) {
  return tasks.reduce((summary, task) => {
    summary.total += 1;
    if (task.status === "todo") summary.todo += 1;
    if (task.status === "in-progress") summary.inProgress += 1;
    if (task.status === "done") summary.completed += 1;
    return summary;
  }, { total: 0, todo: 0, inProgress: 0, completed: 0 });
}

function toAttendanceRow(record) {
  return {
    id: record._id.toString(),
    date: record.date,
    status: record.status,
    notes: record.notes,
    student: record.student ? {
      id: record.student._id.toString(),
      rollNumber: record.student.rollNumber,
      batch: record.student.batch,
      name: record.student.user?.name,
      email: record.student.user?.email
    } : null
  };
}

function toAssignmentRow(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    deadline: task.deadline,
    project: task.project ? { id: task.project._id.toString(), title: task.project.title, status: task.project.status } : null,
    assignedTo: task.assignedTo ? { id: task.assignedTo._id.toString(), name: task.assignedTo.name, email: task.assignedTo.email } : null
  };
}

async function getStudentReportData(student) {
  const [attendance, team] = await Promise.all([
    getAttendanceByStudent(student._id),
    Team.findOne({ members: student.user._id }).select("name")
  ]);
  const projects = team ? await Project.find({ team: team._id }).select("title status deadline") : [];
  const tasks = projects.length
    ? await Task.find({ project: { $in: projects.map((project) => project._id) } }).select("title project assignedTo status priority deadline")
    : [];
  const taskCounts = countTasks(tasks);

  return {
    profile: {
      id: student._id.toString(),
      rollNumber: student.rollNumber,
      batch: student.batch,
      phone: student.phone,
      address: student.address,
      name: student.user.name,
      email: student.user.email,
      profileImage: student.user.profileImage?.url ? { url: student.user.profileImage.url } : null
    },
    attendance: countAttendance(attendance),
    team: team ? { id: team._id.toString(), name: team.name } : null,
    projects: projects.map((project) => ({ id: project._id.toString(), title: project.title, status: project.status, deadline: project.deadline })),
    tasks: {
      ...taskCounts,
      assignedToStudent: tasks.filter((task) => task.assignedTo?.toString() === student.user._id.toString()).length
    }
  };
}

export const getAttendanceReport = async (filters) => {
  const records = await getAttendance(filters);
  return { summary: countAttendance(records), records: records.map(toAttendanceRow) };
};

export const getAssignmentReport = async ({ projectId, assignedTo, status, priority } = {}) => {
  const query = {};
  if (projectId) {
    assertObjectId(projectId, "Project id");
    query.project = projectId;
  }
  if (assignedTo) {
    assertObjectId(assignedTo, "Student user id");
    query.assignedTo = assignedTo;
  }
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const tasks = await Task.find(query).populate("project", "title status").populate("assignedTo", "name email");
  return { summary: countTasks(tasks), records: tasks.map(toAssignmentRow) };
};

export const getStudentReport = async (studentId) => {
  assertObjectId(studentId, "Student id");
  const student = await Student.findById(studentId).populate("user", "name email profileImage");
  if (!student) throw appError("Student not found", 404);
  return getStudentReportData(student);
};

export const getMyProgressReport = async (userId) => {
  assertObjectId(userId, "Authenticated user id");
  const student = await Student.findOne({ user: userId }).populate("user", "name email profileImage");
  if (!student) throw appError("Student profile not found", 404);
  return getStudentReportData(student);
};

import Student from "../students/student.model.js";
import Attendance from "../attendance/attendance.model.js";
import Team from "../teams/team.model.js";
import Task from "../tasks/task.model.js";
import { getDayRange } from "../../utils/dateRange.js";

function countByStatus(rows, statuses) {
  const counts = Object.fromEntries(rows.map((row) => [row._id, row.count]));
  return Object.fromEntries(statuses.map(([key, status]) => [key, counts[status] || 0]));
}

export async function getDashboardStats() {
  const { start, end } = getDayRange();
  const today = { $gte: start, $lte: end };

  const [totalStudents, totalTeams, pendingTasks, attendanceRows, taskRows, dueTodayRows, students, teams] = await Promise.all([
    Student.countDocuments(),
    Team.countDocuments(),
    Task.countDocuments({ status: "todo" }),
    Attendance.aggregate([{ $match: { date: today } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: { deadline: today } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Student.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email").lean(),
    Team.aggregate([
      { $project: { _id: 1, name: 1, createdAt: 1, memberCount: { $size: "$members" } } },
      { $sort: { createdAt: -1 } },
      { $limit: 5 }
    ])
  ]);

  const attendance = countByStatus(attendanceRows, [["present", "present"], ["absent", "absent"], ["leave", "leave"], ["late", "late"]]);
  attendance.total = attendance.present + attendance.absent + attendance.leave + attendance.late;
  const tasks = countByStatus(taskRows, [["pending", "todo"], ["inProgress", "in-progress"], ["completed", "done"]]);
  tasks.total = tasks.pending + tasks.inProgress + tasks.completed;
  tasks.dueToday = countByStatus(dueTodayRows, [["pending", "todo"], ["inProgress", "in-progress"], ["completed", "done"]]);
  tasks.dueToday.total = tasks.dueToday.pending + tasks.dueToday.inProgress + tasks.dueToday.completed;

  return {
    summary: { totalStudents, presentToday: attendance.present, absentToday: attendance.absent, totalTeams, pendingTasks },
    attendance,
    tasks,
    students: students.map((student) => ({ id: student._id.toString(), rollNumber: student.rollNumber, batch: student.batch, name: student.user?.name, email: student.user?.email })),
    teams: { total: totalTeams, items: teams.map((team) => ({ id: team._id.toString(), name: team.name, memberCount: team.memberCount })) }
  };
}

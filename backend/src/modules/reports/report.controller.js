import { getAttendanceReport, getAssignmentReport, getStudentReport, getMyProgressReport } from "./report.service.js";
import { success } from "../../utils/response.js";

function csvValue(value) {
  const text = String(value ?? "").replace(/"/g, '""');
  return /^[=+\-@]/.test(text) ? `"'${text}"` : `"${text}"`;
}

function sendCsv(res, filename, columns, rows) {
  const body = [columns, ...rows].map((row) => row.map(csvValue).join(",")).join("\n");
  res.type("text/csv").attachment(filename).send(body);
}

export const getAttendanceReportController = async (req, res, next) => {
  try {
    return success(res, await getAttendanceReport(req.validatedQuery));
  } catch (err) {
    next(err);
  }
};

export const exportAttendanceCsvController = async (req, res, next) => {
  try {
    const report = await getAttendanceReport(req.validatedQuery);
    return sendCsv(res, "attendance-report.csv", ["Date", "Status", "Roll number", "Student", "Email", "Notes"], report.records.map((record) => [record.date.toISOString(), record.status, record.student?.rollNumber, record.student?.name, record.student?.email, record.notes]));
  } catch (err) {
    next(err);
  }
};

export const getAssignmentReportController = async (req, res, next) => {
  try {
    return success(res, await getAssignmentReport(req.validatedQuery));
  } catch (err) {
    next(err);
  }
};

export const exportAssignmentCsvController = async (req, res, next) => {
  try {
    const report = await getAssignmentReport(req.validatedQuery);
    return sendCsv(res, "assignment-report.csv", ["Task", "Project", "Status", "Priority", "Deadline", "Assigned student", "Email"], report.records.map((record) => [record.title, record.project?.title, record.status, record.priority, record.deadline?.toISOString?.() || "", record.assignedTo?.name, record.assignedTo?.email]));
  } catch (err) {
    next(err);
  }
};

export const getStudentReportController = async (req, res, next) => {
  try {
    return success(res, await getStudentReport(req.params.studentId));
  } catch (err) {
    next(err);
  }
};

export const exportStudentCsvController = async (req, res, next) => {
  try {
    const reportData = await getStudentReport(req.params.studentId);
    const p = reportData.profile || {};
    const att = reportData.attendance || {};
    const t = reportData.tasks || {};
    const filename = `student-${p.rollNumber || "report"}-card.csv`;

    const columns = ["Field", "Value"];
    const rows = [
      ["Full Name", p.name || ""],
      ["Email Address", p.email || ""],
      ["Roll Number", p.rollNumber || ""],
      ["Batch", p.batch || ""],
      ["Assigned Team", reportData.team?.name || "Unassigned"],
      ["Phone", p.phone || ""],
      ["Address", p.address || ""],
      ["Total Attendance Days", att.total || 0],
      ["Present Days", att.present || 0],
      ["Absent Days", att.absent || 0],
      ["Late Days", att.late || 0],
      ["Leave Days", att.leave || 0],
      ["Total Tasks Assigned", t.total || 0],
      ["Tasks Completed", t.completed || 0],
      ["Tasks In-Progress", t.inProgress || 0],
      ["Tasks To-Do", t.todo || 0],
    ];

    return sendCsv(res, filename, columns, rows);
  } catch (err) {
    next(err);
  }
};

export const getMyProgressReportController = async (req, res, next) => {
  try {
    return success(res, await getMyProgressReport(req.user.userId));
  } catch (err) {
    next(err);
  }
};

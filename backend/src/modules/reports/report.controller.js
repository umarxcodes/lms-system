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

export const getMyProgressReportController = async (req, res, next) => {
  try {
    return success(res, await getMyProgressReport(req.user.userId));
  } catch (err) {
    next(err);
  }
};

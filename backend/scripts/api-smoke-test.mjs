import assert from "node:assert/strict";
import { once } from "node:events";
import { URL } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const testUri = process.env.TEST_MONGO_URI;
if (!testUri) throw new Error("TEST_MONGO_URI is required");

const databaseName = new URL(testUri).pathname.replace(/^\//, "");
if (!databaseName.startsWith("bootcamp_lms_api_test_")) {
  throw new Error("TEST_MONGO_URI must target a database beginning with bootcamp_lms_api_test_");
}

process.env.MONGO_URI = testUri;
process.env.NODE_ENV = "test";

const [{ default: mongoose }, { default: app }, { default: User, ROLES }, { default: AdminSettings }] = await Promise.all([
  import("mongoose"),
  import("../src/app.js"),
  import("../src/modules/auth/auth.model.js"),
  import("../src/modules/settings/settings.model.js")
]);

const server = app.listen(0, "127.0.0.1");
await once(server, "listening");
const baseUrl = `http://127.0.0.1:${server.address().port}/api/v1`;
let assertions = 0;
let requestQueue = Promise.resolve();
let queuedError;

function expect(condition, message) {
  assertions += 1;
  assert.ok(condition, message);
}

async function request(method, path, { token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { "content-type": "application/json" } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  return { response, data, contentType };
}

async function expectStatus(method, path, expected, options) {
  const job = requestQueue.then(async () => {
    const result = await request(method, path, options);
    expect(result.response.status === expected, `${method} ${path}: expected ${expected}, received ${result.response.status}`);
    return result;
  });
  requestQueue = job.catch((error) => {
    queuedError ||= error;
  });
  job.catch(() => undefined);
  return job;
}

try {
  await mongoose.connect(testUri);
  await mongoose.connection.dropDatabase();

  await User.create({ name: "Audit Admin", email: "audit.admin@example.test", password: "AuditPass123!", role: ROLES.ADMIN });

  await expectStatus("GET", "/missing", 404);
  await expectStatus("GET", "/students/me", 401);
  await expectStatus("POST", "/auth/login", 400, { body: {} });
  await expectStatus("POST", "/auth/login", 401, { body: { email: "audit.admin@example.test", password: "wrong-password" } });

  const adminLogin = await expectStatus("POST", "/auth/login", 200, { body: { email: "audit.admin@example.test", password: "AuditPass123!" } });
  let adminToken = adminLogin.data.data.token;
  const adminUserId = adminLogin.data.data.user.id;
  expect(typeof adminToken === "string", "Admin login must return a token");
  expectStatus("GET", "/auth/me", 200, { token: adminToken });

  const studentPayload = (name, email, rollNumber) => ({ name, email, password: "StudentPass123!", rollNumber, batch: "Audit Batch" });
  const studentA = await expectStatus("POST", "/students", 201, { token: adminToken, body: studentPayload("Student A", "student.a@example.test", "AUDIT-A") });
  const studentB = await expectStatus("POST", "/students", 201, { token: adminToken, body: studentPayload("Student B", "student.b@example.test", "AUDIT-B") });
  const studentC = await expectStatus("POST", "/students", 201, { token: adminToken, body: studentPayload("Student C", "student.c@example.test", "AUDIT-C") });
  const studentAId = studentA.data.data._id;
  const studentBId = studentB.data.data._id;
  const studentCId = studentC.data.data._id;
  const studentAUserId = studentA.data.data.user._id;
  const studentBUserId = studentB.data.data.user._id;
  const studentD = await expectStatus("POST", "/students", 201, { token: adminToken, body: studentPayload("Student D", "student.d@example.test", "AUDIT-D") });
  const studentDId = studentD.data.data._id;
  expectStatus("POST", "/students", 409, { token: adminToken, body: studentPayload("Duplicate", "student.a@example.test", "AUDIT-D") });
  expectStatus("GET", "/students", 200, { token: adminToken });
  expectStatus("GET", `/students/${studentAId}`, 200, { token: adminToken });
  expectStatus("PATCH", `/students/${studentAId}`, 200, { token: adminToken, body: { phone: "03000000000" } });
  expectStatus("PUT", `/students/${studentAId}`, 200, { token: adminToken, body: { address: "Audit address" } });

  const studentALogin = await expectStatus("POST", "/auth/login", 200, { body: { email: "student.a@example.test", password: "StudentPass123!" } });
  const studentBLogin = await expectStatus("POST", "/auth/login", 200, { body: { email: "student.b@example.test", password: "StudentPass123!" } });
  const studentAToken = studentALogin.data.data.token;
  const studentBToken = studentBLogin.data.data.token;
  expectStatus("GET", "/students/me", 200, { token: studentAToken });
  expectStatus("GET", `/students/${studentBId}`, 403, { token: studentAToken });
  expectStatus("POST", "/students", 403, { token: studentAToken, body: studentPayload("Blocked", "blocked@example.test", "AUDIT-X") });

  await expectStatus("GET", "/settings/profile", 401);
  const settingsEndpoints = [
    ["GET", "/settings/profile"],
    ["PATCH", "/settings/profile", { name: "Blocked" }],
    ["PATCH", "/settings/password", { currentPassword: "StudentPass123!", newPassword: "StudentPass456!", confirmPassword: "StudentPass456!" }],
    ["GET", "/settings/application"],
    ["PATCH", "/settings/application", { applicationName: "Blocked" }],
    ["GET", "/settings/notifications"],
    ["PATCH", "/settings/notifications", { emailNotifications: false }],
    ["GET", "/settings/security"]
  ];
  for (const [method, path, body] of settingsEndpoints) {
    expectStatus(method, path, 403, { token: studentAToken, ...(body ? { body } : {}) });
  }

  const adminProfile = await expectStatus("GET", "/settings/profile", 200, { token: adminToken });
  expect(adminProfile.data.data.role === ROLES.ADMIN, "Settings profile must return Admin role");
  expect(!("password" in adminProfile.data.data), "Settings profile must not return password");
  expectStatus("PATCH", "/settings/profile", 400, { token: adminToken, body: { role: ROLES.STUDENT } });
  expectStatus("PATCH", "/settings/profile", 400, { token: adminToken, body: { email: "not-an-email" } });
  expectStatus("PATCH", "/settings/profile", 400, { token: adminToken, body: { name: "" } });
  expectStatus("PATCH", "/settings/profile", 409, { token: adminToken, body: { email: "student.a@example.test" } });
  const updatedAdminProfile = await expectStatus("PATCH", "/settings/profile", 200, { token: adminToken, body: { name: "Audit Admin Updated", email: "audit.admin.updated@example.test" } });
  expect(updatedAdminProfile.data.data.email === "audit.admin.updated@example.test", "Updated Admin email must persist in response");
  expect(updatedAdminProfile.data.data.role === ROLES.ADMIN, "Profile update must not change Admin role");

  const appSettings = await expectStatus("GET", "/settings/application", 200, { token: adminToken });
  expect(appSettings.data.data.applicationName === "Bootcamp LMS", "Default application name must be returned");
  expectStatus("PATCH", "/settings/application", 400, { token: adminToken, body: { adminId: studentAUserId } });
  expectStatus("PATCH", "/settings/application", 400, { token: adminToken, body: { defaultPageSize: 0 } });
  const updatedAppSettings = await expectStatus("PATCH", "/settings/application", 200, { token: adminToken, body: { applicationName: "Audit LMS", timezone: "Asia/Karachi", dateFormat: "DD-MM-YYYY", defaultPageSize: 25 } });
  expect(updatedAppSettings.data.data.applicationName === "Audit LMS", "Application settings update must persist in response");
  expect(updatedAppSettings.data.data.defaultPageSize === 25, "Default page size update must persist in response");

  const notificationSettings = await expectStatus("GET", "/settings/notifications", 200, { token: adminToken });
  expect(notificationSettings.data.data.emailNotifications === true, "Default email notifications must be enabled");
  expectStatus("PATCH", "/settings/notifications", 400, { token: adminToken, body: { role: ROLES.STUDENT } });
  expectStatus("PATCH", "/settings/notifications", 400, { token: adminToken, body: { taskNotifications: "yes" } });
  const updatedNotificationSettings = await expectStatus("PATCH", "/settings/notifications", 200, { token: adminToken, body: { emailNotifications: false, projectNotifications: false } });
  expect(updatedNotificationSettings.data.data.emailNotifications === false, "Notification preference update must persist in response");

  const securitySettings = await expectStatus("GET", "/settings/security", 200, { token: adminToken });
  expect(securitySettings.data.data.accountStatus === "active", "Security settings must expose active account status");
  expect(!("password" in securitySettings.data.data), "Security settings must not return password");

  const persistedSettings = await AdminSettings.findOne({ admin: adminUserId }).lean();
  expect(persistedSettings.application.applicationName === "Audit LMS", "Application settings must persist in MongoDB");
  expect(persistedSettings.notifications.emailNotifications === false, "Notification preferences must persist in MongoDB");

  expectStatus("PATCH", "/settings/password", 401, { token: adminToken, body: { currentPassword: "wrong-password", newPassword: "AuditPass456!", confirmPassword: "AuditPass456!" } });
  expectStatus("PATCH", "/settings/password", 400, { token: adminToken, body: { currentPassword: "AuditPass123!", newPassword: "short", confirmPassword: "short" } });
  expectStatus("PATCH", "/settings/password", 400, { token: adminToken, body: { currentPassword: "AuditPass123!", newPassword: "AuditPass456!", confirmPassword: "Mismatch456!" } });
  expectStatus("PATCH", "/settings/password", 400, { token: adminToken, body: { currentPassword: "AuditPass123!", newPassword: "AuditPass456!", confirmPassword: "AuditPass456!", passwordHash: "blocked" } });
  const passwordChange = await expectStatus("PATCH", "/settings/password", 200, { token: adminToken, body: { currentPassword: "AuditPass123!", newPassword: "AuditPass456!", confirmPassword: "AuditPass456!" } });
  expect(passwordChange.data.data.passwordChanged === true, "Password change must report success");
  expectStatus("POST", "/auth/login", 401, { body: { email: "audit.admin.updated@example.test", password: "AuditPass123!" } });
  const updatedAdminLogin = await expectStatus("POST", "/auth/login", 200, { body: { email: "audit.admin.updated@example.test", password: "AuditPass456!" } });
  adminToken = updatedAdminLogin.data.data.token;

  const teamA = await expectStatus("POST", "/teams", 201, { token: adminToken, body: { name: "Audit Team A", members: [studentAUserId] } });
  const teamB = await expectStatus("POST", "/teams", 201, { token: adminToken, body: { name: "Audit Team B", members: [studentBUserId] } });
  const teamAId = teamA.data.data._id;
  const teamBId = teamB.data.data._id;
  expectStatus("GET", "/teams", 200, { token: adminToken });
  expectStatus("GET", `/teams/${teamAId}`, 200, { token: adminToken });
  expectStatus("GET", "/teams/me", 200, { token: studentAToken });
  expectStatus("GET", `/teams/${teamBId}`, 403, { token: studentAToken });
  expectStatus("POST", `/teams/${teamAId}/members`, 200, { token: adminToken, body: { studentId: studentCId } });
  expectStatus("GET", `/teams/${teamAId}/members`, 200, { token: studentAToken });
  expectStatus("DELETE", `/teams/${teamAId}/members/${studentCId}`, 200, { token: adminToken });
  expectStatus("PATCH", `/teams/${teamAId}`, 200, { token: adminToken, body: { description: "Audit team" } });

  const today = new Date().toISOString().slice(0, 10);
  const attendance = await expectStatus("POST", "/attendance", 201, { token: adminToken, body: { studentId: studentAId, date: today, status: "present" } });
  const attendanceId = attendance.data.data._id;
  expectStatus("POST", "/attendance/mark", 409, { token: adminToken, body: { studentId: studentAId, date: today, status: "present" } });
  expectStatus("GET", "/attendance", 200, { token: adminToken });
  expectStatus("GET", "/attendance/me", 200, { token: studentAToken });
  expectStatus("GET", `/attendance/student/${studentAId}`, 200, { token: adminToken });
  expectStatus("GET", `/attendance/date/${today}`, 200, { token: adminToken });
  expectStatus("GET", `/attendance/${attendanceId}`, 403, { token: studentBToken });
  expectStatus("GET", `/attendance/${attendanceId}`, 200, { token: adminToken });
  expectStatus("PATCH", `/attendance/${attendanceId}`, 200, { token: adminToken, body: { notes: "Audit verified" } });

  const projectA = await expectStatus("POST", "/projects", 201, { token: adminToken, body: { title: "Audit Project A", teamId: teamAId } });
  const projectB = await expectStatus("POST", "/projects", 201, { token: adminToken, body: { title: "Audit Project B", teamId: teamBId } });
  const projectAId = projectA.data.data._id;
  const projectBId = projectB.data.data._id;
  expectStatus("GET", "/projects", 200, { token: adminToken });
  expectStatus("GET", "/projects/me", 200, { token: studentAToken });
  expectStatus("GET", `/projects/${projectAId}`, 200, { token: adminToken });
  expectStatus("GET", `/projects/${projectBId}`, 403, { token: studentAToken });
  expectStatus("PATCH", `/projects/${projectAId}`, 200, { token: adminToken, body: { description: "Audit project" } });
  expectStatus("PATCH", `/projects/${projectAId}/status`, 200, { token: adminToken, body: { status: "in-progress" } });

  const taskA = await expectStatus("POST", "/tasks", 201, { token: adminToken, body: { title: "Audit Task A", projectId: projectAId, assignedTo: studentAUserId, priority: "high" } });
  const taskB = await expectStatus("POST", "/tasks", 201, { token: adminToken, body: { title: "Audit Task B", projectId: projectBId, assignedTo: studentBUserId } });
  const taskAId = taskA.data.data._id;
  const taskBId = taskB.data.data._id;
  expectStatus("POST", "/tasks", 400, { token: adminToken, body: { title: "Cross team", projectId: projectAId, assignedTo: studentBUserId } });
  expectStatus("GET", "/tasks", 200, { token: adminToken });
  expectStatus("GET", "/tasks/me", 200, { token: studentAToken });
  expectStatus("GET", "/tasks/my-assigned", 200, { token: studentAToken });
  expectStatus("GET", `/tasks/${taskBId}`, 403, { token: studentAToken });
  expectStatus("GET", `/tasks/${taskAId}`, 200, { token: adminToken });
  expectStatus("PATCH", `/tasks/${taskAId}`, 200, { token: adminToken, body: { description: "Audit task" } });
  expectStatus("PATCH", `/tasks/${taskAId}/status`, 200, { token: adminToken, body: { status: "in-progress" } });
  expectStatus("PATCH", `/tasks/${taskAId}/assign`, 200, { token: adminToken, body: { userId: studentAUserId } });
  expectStatus("DELETE", `/projects/${projectAId}`, 409, { token: adminToken });

  expectStatus("GET", "/students/dashboard", 200, { token: studentAToken });
  expectStatus("GET", "/reports/me", 200, { token: studentAToken });
  expectStatus("GET", "/reports/attendance", 200, { token: adminToken });
  expectStatus("GET", "/reports/assignments", 200, { token: adminToken });
  expectStatus("GET", `/reports/students/${studentAId}`, 200, { token: adminToken });
  const attendanceCsv = await expectStatus("GET", "/reports/attendance/export.csv", 200, { token: adminToken });
  expect(attendanceCsv.contentType.includes("text/csv"), "Attendance export must be CSV");
  const assignmentCsv = await expectStatus("GET", "/reports/assignments/export.csv", 200, { token: adminToken });
  expect(assignmentCsv.contentType.includes("text/csv"), "Assignment export must be CSV");

  const announcement = await expectStatus("POST", "/notifications/announcements", 201, { token: adminToken, body: { title: "Audit announcement", message: "Audit message", recipientIds: [studentAUserId] } });
  expect(announcement.data.data.count === 1, "Announcement must target one Student");
  const notifications = await expectStatus("GET", "/notifications/me", 200, { token: studentAToken });
  const notificationId = notifications.data.data.items[0]._id;
  expectStatus("GET", "/notifications/unread", 200, { token: studentAToken });
  expectStatus("GET", "/notifications/unread/count", 200, { token: studentAToken });
  expectStatus("PATCH", `/notifications/${notificationId}/read`, 404, { token: studentBToken });
  expectStatus("PATCH", `/notifications/${notificationId}/read`, 200, { token: studentAToken });
  expectStatus("PATCH", "/notifications/read-all", 200, { token: studentAToken });
  expectStatus("DELETE", `/notifications/${notificationId}`, 200, { token: studentAToken });

  expectStatus("GET", "/admin/dashboard", 200, { token: adminToken });
  expectStatus("DELETE", `/tasks/${taskAId}`, 200, { token: adminToken });
  expectStatus("DELETE", `/projects/${projectAId}`, 200, { token: adminToken });
  expectStatus("DELETE", `/tasks/${taskBId}`, 200, { token: adminToken });
  expectStatus("DELETE", `/projects/${projectBId}`, 200, { token: adminToken });
  expectStatus("DELETE", `/teams/${teamAId}`, 409, { token: adminToken });
  expectStatus("DELETE", `/teams/${teamBId}`, 409, { token: adminToken });
  const emptyTeam = await expectStatus("POST", "/teams", 201, { token: adminToken, body: { name: "Audit Empty Team" } });
  expectStatus("DELETE", `/teams/${emptyTeam.data.data._id}`, 200, { token: adminToken });
  expectStatus("DELETE", `/students/${studentDId}`, 200, { token: adminToken });

  await requestQueue;
  if (queuedError) throw queuedError;
  console.log(`API smoke test passed with ${assertions} assertions against ${databaseName}`);
} finally {
  await mongoose.connection.dropDatabase().catch(() => undefined);
  await mongoose.disconnect().catch(() => undefined);
  await new Promise((resolve) => server.close(resolve));
}

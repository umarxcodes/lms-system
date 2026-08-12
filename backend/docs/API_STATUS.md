# Bootcamp LMS API Status

Status reflects the local smoke-test suite against the disposable `bootcamp_lms_api_test_*` database.

| Module | Status | Notes |
| --- | --- | --- |
| Authentication | PASS | Login, invalid login, `/auth/me`, token failures tested |
| Students | PASS | Admin CRUD, duplicate protection, Student ownership tested |
| Attendance | PASS | Admin management, duplicate day protection, Student isolation tested |
| Teams | PASS | Admin management, Student own-team access, cross-team block tested |
| Projects | PASS | Admin management, Student team ownership, delete constraints tested |
| Tasks | PASS | Admin management, cross-team assignment block, Student ownership tested |
| Dashboard | PASS | Admin and Student dashboard flows tested |
| Reports | PASS | Attendance, assignment, Student progress, CSV exports tested |
| Notifications | PASS | Announcement, own notification reads, IDOR protection tested |
| Admin Settings | PASS | Profile, password, application, notifications, security, RBAC, and mass assignment tests added |
| Profile Images | PASS | Admin and Student upload, replace, delete, file validation, ownership, MongoDB metadata, and regression tested |

Known limitation: Settings `lastLogin` is reported as `null` because the current authentication module does not persist login timestamps.

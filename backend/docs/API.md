# Bootcamp LMS API

This document records the Settings API added for the Admin Portal. All endpoints use the existing `/api/v1` prefix and existing JSON response shape.

## Admin Settings

All Settings endpoints require:

```http
Authorization: Bearer <ADMIN_JWT>
```

Students receive `403`. Missing or invalid tokens receive `401`.

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/settings/profile` | Required | ADMIN | Return safe Admin profile fields |
| PATCH | `/api/v1/settings/profile` | Required | ADMIN | Update `name` and/or `email` |
| POST | `/api/v1/settings/profile/avatar` | Required | ADMIN | Upload or replace own profile image |
| DELETE | `/api/v1/settings/profile/avatar` | Required | ADMIN | Delete own profile image |
| PATCH | `/api/v1/settings/password` | Required | ADMIN | Change Admin password |
| GET | `/api/v1/settings/application` | Required | ADMIN | Return application preferences |
| PATCH | `/api/v1/settings/application` | Required | ADMIN | Update supported application preferences |
| GET | `/api/v1/settings/notifications` | Required | ADMIN | Return notification preferences |
| PATCH | `/api/v1/settings/notifications` | Required | ADMIN | Update notification preferences |
| GET | `/api/v1/settings/security` | Required | ADMIN | Return supported security metadata |

### Profile

`GET /api/v1/settings/profile` returns `id`, `name`, `email`, `role`, `createdAt`, and `updatedAt`.

`PATCH /api/v1/settings/profile` body:

```json
{
  "name": "Bootcamp Admin",
  "email": "admin@example.com"
}
```

Validation:

- `name` is optional but cannot be empty when provided.
- `email` is optional but must be valid and unique when provided.
- Unknown or protected fields are rejected.
- Duplicate email returns `409`.

`POST /api/v1/settings/profile/avatar` uses `multipart/form-data` with one file field named `avatar`. Supported image content is JPEG/JPG, PNG, or WEBP up to 2MB. The backend validates MIME type and file signature. A successful response returns only:

```json
{
  "profileImage": {
    "url": "https://res.cloudinary.com/.../image/upload/..."
  }
}
```

`DELETE /api/v1/settings/profile/avatar` deletes the stored Cloudinary asset by `publicId`, removes metadata from MongoDB, and returns `{ "profileImage": null }`.

### Password

`PATCH /api/v1/settings/password` body:

```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

Validation:

- Current password is verified against the existing bcrypt hash.
- New password must be at least 8 characters.
- Confirmation must match.
- Passwords and hashes are never returned.

### Application Preferences

`GET /api/v1/settings/application` returns:

```json
{
  "applicationName": "Bootcamp LMS",
  "timezone": "Asia/Karachi",
  "dateFormat": "YYYY-MM-DD",
  "defaultPageSize": 20
}
```

`PATCH /api/v1/settings/application` accepts any supported subset. `dateFormat` must be one of `YYYY-MM-DD`, `DD-MM-YYYY`, or `MM-DD-YYYY`; `defaultPageSize` must be 1 through 100.

### Notification Preferences

`GET /api/v1/settings/notifications` returns:

```json
{
  "emailNotifications": true,
  "taskNotifications": true,
  "attendanceNotifications": true,
  "projectNotifications": true,
  "systemNotifications": true
}
```

`PATCH /api/v1/settings/notifications` accepts any supported boolean subset.

### Security

`GET /api/v1/settings/security` returns supported metadata:

```json
{
  "accountStatus": "active",
  "lastLogin": null,
  "passwordChangedAt": null,
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

`lastLogin` is currently `null` because the existing authentication system does not persist login timestamps. JWTs remain stateless; password changes do not invalidate already issued tokens because no token blacklist/session store is implemented.

## Student Profile Image

Student profile image endpoints require:

```http
Authorization: Bearer <STUDENT_JWT>
```

| Method | Endpoint | Auth | Role | Purpose |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/students/me/avatar` | Required | STUDENT | Upload or replace own profile image |
| DELETE | `/api/v1/students/me/avatar` | Required | STUDENT | Delete own profile image |

Both endpoints derive ownership from the verified JWT. Request body fields such as `studentId`, `userId`, or `adminId` are not accepted as ownership proof. Student A cannot modify Student B's image because there is no cross-user image endpoint.

Upload requirements match Admin avatar upload: `multipart/form-data`, one `avatar` file, JPEG/JPG/PNG/WEBP content, maximum 2MB.

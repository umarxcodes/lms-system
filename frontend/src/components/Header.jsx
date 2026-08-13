import {
  InputBase,
  Box,
  Stack,
  Typography,
  Avatar,
  Button,
  IconButton,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Reusable page header. Title/subtitle sit on the left; anything page-specific
 * (search field, buttons, notification bell, date picker, UserProfile) is
 * passed in via `actions` so each page controls its own right-side content.
 *
 * Usage (Tasks page):
 *   <Header
 *     title="Tasks Management"
 *     subtitle="Assign, track, and approve student deliverables and team tasks."
 *     actions={
 *       <>
 *         <Button variant="contained">Assign Task</Button>
 *         <UserProfile showDetails={false} />
 *       </>
 *     }
 *   />
 *
 * Usage (Students page - no subtitle, tighter padding):
 *   <Header title="Students" actions={...} sx={{ px: { xs: 3, lg: 5 }, pt: 3 }} />
 */
export default function Header({ title, subtitle, actions, sx }) {
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 4, lg: 5 },
        pt: 4,
        pb: 2.5,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 700,
              color: "grey.900",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 14, color: "grey.500", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        {actions && (
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

/**
 * Avatar + optional name/role chip shown in the header's actions slot.
 * Dashboard / Attendance / Students show the full chip.
 * Tasks / Teams show just the bare avatar -> pass showDetails={false}.
 */
export function UserProfile({
  name = "Ali Khan",
  role = "System Admin",
  avatarSrc = "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
  showDetails = true,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        pl: 0.5,
        cursor: "pointer",
      }}
    >
      <Avatar
        src={avatarSrc}
        alt={name}
        sx={{
          width: 36,
          height: 36,
          border: "2px solid #fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      />

      {showDetails && (
        <Box sx={{ display: { xs: "none", md: "block" }, lineHeight: 1.2 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "grey.900" }}>
            {name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "grey.500" }}>
            {role}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

/**
 * Notification bell button shown in the header's actions slot.
 * Matches: a white square icon button with a small green "unread" dot,
 * no count badge. Used on Dashboard and Students.
 *
 * Usage:
 *   import NotificationButton from "../components/NotificationButton";
 *   <NotificationButton onClick={() => {...}} />
 */
export const NotificationButton = ({ onClick, hasUnread = true }) => {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: { xs: 36, md: 40 },
        height: { xs: 36, md: 40 },
        bgcolor: "#fff",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2, // rounded-lg
        color: "grey.500",
        position: "relative",
        "&:hover": {
          bgcolor: "grey.50",
          color: "grey.900",
        },
      }}
    >
      <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />

      {hasUnread && (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#22c55e", // green-500
            border: "2px solid #fff",
          }}
        />
      )}
    </IconButton>
  );
};

/**
 * Date button shown in the header's actions slot (e.g. Attendance page).
 * Matches: a white bordered pill with a calendar icon + date text.
 *
 * Usage:
 *   import DateButton from "../components/DateButton";
 *   <DateButton date="Oct 24, 2024" onClick={() => {...}} />
 *
 * `date` accepts a pre-formatted string, or omit it and pass a Date object
 * via `value` to have it formatted automatically.
 */
export const DateButton = ({ date, value, onClick }) => {
  const label =
    date ??
    (value ?? new Date()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Button
      onClick={onClick}
      startIcon={
        <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: "grey.400" }} />
      }
      sx={{
        bgcolor: "#fff",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2, // rounded-lg
        px: 1.75, // px-3
        py: 1, // py-2
        color: "grey.700",
        fontSize: 14,
        fontWeight: 500,
        textTransform: "none",
        whiteSpace: "nowrap",
        "&:hover": {
          bgcolor: "grey.50",
          borderColor: "grey.200",
        },
      }}
    >
      {label}
    </Button>
  );
};

/**
 * Search input shown in the header's actions slot (e.g. Dashboard page)
 * or in a page's filter bar (e.g. Students, Teams).
 * Matches: icon-left input, white/gray bg, rounded-lg border, focus ring.
 *
 * Usage (header, Dashboard):
 *   <SearchField placeholder="Search students…" value={q} onChange={setQ} />
 *
 * Usage (filter bar, wider, gray background):
 *   <SearchField
 *     placeholder="Search..."
 *     value={q}
 *     onChange={setQ}
 *     width="100%"
 *     bgcolor="grey.50"
 *   />
 */
export function SearchField({
  placeholder = "Search…",
  value,
  onChange,
  width = 256, // w-64
  bgcolor = "#fff",
  size = "medium", // "medium" (header) | "small" (filter bars)
}) {
  const isSmall = size === "small";

  return (
    <Box
      sx={{
        position: "relative",
        width,
        display: { xs: "none", sm: "block" },
      }}
    >
      <SearchIcon
        sx={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: isSmall ? 16 : 18,
          color: "grey.400",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <InputBase
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        sx={{
          width: "100%",
          bgcolor,
          border: "1px solid",
          borderColor: "grey.200",
          borderRadius: 2, // rounded-lg
          fontSize: 14,
          pl: 4.5, // room for the icon
          pr: 1.5,
          py: isSmall ? 0.75 : 1,
          color: "grey.800",
          transition: "border-color .15s ease, box-shadow .15s ease",
          "&:hover": {
            borderColor: "grey.300",
          },
          "&.Mui-focused": {
            borderColor: "#60a5fa", // brand-400
            boxShadow: "0 0 0 3px rgba(59,130,246,0.15)", // brand-500/20 ring
          },
          "& input::placeholder": {
            color: "grey.400",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
}

import { env } from "../config/env.js";

function timezoneOffsetMilliseconds(date, timezone) {
  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    timeZoneName: "longOffset"
  }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
  const match = offset?.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) throw new Error(`Invalid dashboard timezone: ${timezone}`);
  const minutes = (Number(match[2]) * 60) + Number(match[3]);
  return (match[1] === "+" ? 1 : -1) * minutes * 60 * 1000;
}

export function getDayRange(now = new Date(), timezone = env.DASHBOARD_TIMEZONE) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const value = (type) => Number(parts.find((part) => part.type === type).value);
  const utcMidnight = Date.UTC(value("year"), value("month") - 1, value("day"));
  const start = new Date(utcMidnight - timezoneOffsetMilliseconds(new Date(utcMidnight), timezone));
  return { start, end: new Date(start.getTime() + (24 * 60 * 60 * 1000) - 1) };
}

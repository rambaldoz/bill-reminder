/** Every IANA timezone name the runtime knows about. */
export const TIMEZONES: string[] = (
  typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : []
) as string[];

/** The current date (YYYY-MM-DD) and time (HH:MM, 24h) in a given IANA timezone. */
export function nowInTimezone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
}

/** A short, readable label for a timezone, e.g. "Asia/Dubai (GMT+4)". */
export function timezoneLabel(timeZone: string) {
  try {
    const offsetPart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(new Date())
      .find((p) => p.type === "timeZoneName")?.value;
    return offsetPart ? `${timeZone} (${offsetPart})` : timeZone;
  } catch {
    return timeZone;
  }
}

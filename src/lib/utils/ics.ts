/** Generates an .ics file content for a recurring standup reminder. */
export function generateStandupICS(params: {
  standupTime: string; // HH:MM
  timezone: string;
  name: string;
}): string {
  const [hours, minutes] = params.standupTime.split(":").map(Number);

  // Start from tomorrow
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 10);

  const formatDate = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");

  const uid = `anchor-standup-${Date.now()}@anchor.app`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anchor//Standup//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${params.timezone}:${formatDate(start)}`,
    `DTEND;TZID=${params.timezone}:${formatDate(end)}`,
    "RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
    `SUMMARY:Anchor — Daily Standup`,
    `DESCRIPTION:Hey ${params.name}\\, time for your daily standup. Open Anchor and start talking.`,
    "BEGIN:VALARM",
    "TRIGGER:-PT5M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Standup in 5 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

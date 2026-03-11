/** Generates an .ics file for a one-time weekly founder call. */
export function generateWeeklyCallICS(params: {
  timezone: string;
  name: string;
  partnerName: string;
  partnerEmail?: string;
}): string {
  // Next Wednesday by default
  const start = new Date();
  const daysUntilWed = (3 - start.getDay() + 7) % 7 || 7;
  start.setDate(start.getDate() + daysUntilWed);
  start.setHours(15, 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 30);

  const formatDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const uid = `anchor-call-${Date.now()}@anchor.app`;
  const attendee = params.partnerEmail
    ? `ATTENDEE;CN=${params.partnerName}:mailto:${params.partnerEmail}`
    : "";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anchor//WeeklyCall//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${params.timezone}:${formatDate(start)}`,
    `DTEND;TZID=${params.timezone}:${formatDate(end)}`,
    `SUMMARY:Anchor: Weekly Founder Call with ${params.partnerName}`,
    `DESCRIPTION:Your weekly Anchor call with ${params.partnerName}. Share what you shipped\\, what's next\\, and keep each other accountable.`,
    attendee,
    "BEGIN:VALARM",
    "TRIGGER:-PT10M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Founder call in 10 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

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
    `SUMMARY:Anchor - Daily Standup`,
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

/** Returns the Monday of the current week as YYYY-MM-DD. */
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Sunday = 0, so offset to previous Monday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

/** Returns days remaining until next Monday (rotation day). */
export function daysUntilRotation(date: Date = new Date()): number {
  const day = date.getDay();
  if (day === 0) return 1; // Sunday -> Monday tomorrow
  return 8 - day; // Mon=7, Tue=6, ..., Sat=2
}

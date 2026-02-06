/** Get YYYY-MM-DD for the Sunday of the week containing the given date */
export function getWeekOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const sunday = new Date(d);
  sunday.setDate(diff);
  return sunday.toISOString().slice(0, 10);
}

/** Get days remaining in the week (0 = Sunday, 6 = Saturday) */
export function getDaysRemainingInWeek(date: Date): number {
  const d = new Date(date);
  const day = d.getDay();
  return 6 - day;
}

const formatDateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formaterDate(date: Date): string {
  return formatDateLongue.format(date);
}

export function dateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

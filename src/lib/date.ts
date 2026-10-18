const formatDateLongue = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formaterDate(date: Date): string {
  return formatDateLongue.format(date);
}

// formatRange regroupe ce qui est commun : « 24–31 octobre 2026 », « 30 oct. – 2 nov. »…
export function formaterPeriode(debut: Date, fin: Date): string {
  return formatDateLongue.formatRange(debut, fin);
}

export function dateIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

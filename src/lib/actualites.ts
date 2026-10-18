import type { CollectionEntry } from "astro:content";
import { formaterDate, formaterPeriode, dateIso } from "@/lib/date";

type Actualite = CollectionEntry<"actualites">;

/** Vrai si l'actualité annonce un marché qui n'est pas encore terminé. */
function marcheAVenir(actualite: Actualite, aujourdhui: Date): boolean {
  const { debutMarche, finMarche } = actualite.data;
  if (!debutMarche) return false;
  // Les dates du contenu sont à minuit UTC : on compare au jour, pas à l'heure.
  return dateIso(finMarche ?? debutMarche) >= dateIso(aujourdhui);
}

/**
 * Marchés à venir d'abord, du plus proche au plus lointain, puis toutes les autres
 * actualités (marchés passés compris) de la plus récente à la plus ancienne.
 * « Aujourd'hui » est le jour du build : l'ordre se met à jour à chaque publication.
 */
export function actualitesParDate(actualites: Actualite[], aujourdhui = new Date()): Actualite[] {
  const aVenir = actualites.filter((a) => marcheAVenir(a, aujourdhui));
  const autres = actualites.filter((a) => !marcheAVenir(a, aujourdhui));

  // `debutMarche` existe forcément pour un marché à venir (vérifié par marcheAVenir).
  aVenir.sort((a, b) => a.data.debutMarche!.getTime() - b.data.debutMarche!.getTime());
  autres.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return [...aVenir, ...autres];
}

/** Date affichée sur la carte et l'article : celle du marché s'il y en a un, sinon la publication. */
export function dateAffichee(actualite: Actualite): { texte: string; iso: string } {
  const { date, debutMarche, finMarche } = actualite.data;
  if (!debutMarche) return { texte: formaterDate(date), iso: dateIso(date) };

  const texte = finMarche ? formaterPeriode(debutMarche, finMarche) : formaterDate(debutMarche);
  return { texte: `Marché : ${texte}`, iso: dateIso(debutMarche) };
}

import type { CollectionEntry } from "astro:content";

type Actualite = CollectionEntry<"actualites">;

/** Actualités de la plus récente à la plus ancienne. */
export function actualitesParDate(actualites: Actualite[]): Actualite[] {
  return [...actualites].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

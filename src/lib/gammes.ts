import type { CollectionEntry } from "astro:content";

type Gamme = CollectionEntry<"gammes">;

export function gammesAffichees(gammes: Gamme[]): Gamme[] {
  return gammes
    .filter((gamme) => gamme.data.visible)
    .sort((a, b) => a.data.ordre - b.data.ordre);
}

import type { CollectionEntry } from "astro:content";

type Gamme = CollectionEntry<"gammes">;

export function gammesAffichees(gammes: Gamme[]): Gamme[] {
  return gammes
    .filter((gamme) => gamme.data.visible)
    .sort((a, b) => a.data.ordre - b.data.ordre);
}

/**
 * Aperçu des gammes pour l'accueil : 6 cases au plus. Au-delà, la dernière case
 * est réservée à la carte « toutes nos gammes » et `restantes` compte celles qu'on ne montre pas.
 */
export function apercuGammes(gammes: Gamme[], cases = 6): { apercu: Gamme[]; restantes: number } {
  if (gammes.length <= cases) return { apercu: gammes, restantes: 0 };
  const apercu = gammes.slice(0, cases - 1);
  return { apercu, restantes: gammes.length - apercu.length };
}

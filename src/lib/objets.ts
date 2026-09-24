import type { CollectionEntry } from "astro:content";

type Objet = CollectionEntry<"objets">;

/** Objets d'une gamme : les pièces mises en avant d'abord, puis par ordre alphabétique. */
export function objetsDeLaGamme(objets: Objet[], idGamme: string): Objet[] {
  return objets
    .filter((objet) => objet.data.gamme.id === idGamme)
    .sort(
      (a, b) =>
        Number(b.data.misEnAvant) - Number(a.data.misEnAvant) ||
        a.data.titre.localeCompare(b.data.titre, "fr"),
    );
}

const libellesStatut: Record<Objet["data"]["statut"], string | null> = {
  disponible: null,
  "sur-commande": "Sur commande",
  epuise: "Épuisé",
};

/** Texte à afficher sous l'objet ; rien quand il est simplement disponible. */
export function libelleStatut(statut: Objet["data"]["statut"]): string | null {
  return libellesStatut[statut];
}

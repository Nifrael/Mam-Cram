// Traduction des données Sanity vers ce qu'attend le site.
// Fonctions pures : aucune requête ici, voir le loader dans content.config.ts.

/** Fractions (0 à 1) de l'image d'origine, telles que Sanity les enregistre. */
type Recadrage = { top: number; bottom: number; left: number; right: number };
type ZoneImportante = { x: number; y: number };

export type PhotoSanity = {
  url: string;
  largeur: number;
  hauteur: number;
  alt: string;
  crop: Recadrage | null;
  hotspot: ZoneImportante | null;
};

type Morceau = { text: string; marks?: string[] };
export type BlocSanity = { style?: string; children: Morceau[] };

const sansRecadrage: Recadrage = { top: 0, bottom: 0, left: 0, right: 0 };
const auCentre: ZoneImportante = { x: 0.5, y: 0.5 };

const borner = (valeur: number, min: number, max: number) => Math.min(Math.max(valeur, min), max);

/**
 * URL de la photo recadrée au format demandé, en gardant la zone importante
 * choisie dans le Studio au plus près du centre. Sanity découpe l'image
 * (paramètre `rect`), Astro l'optimise ensuite au build.
 */
export function urlPhotoRecadree(photo: PhotoSanity, largeur: number, hauteur: number): string {
  const crop = photo.crop ?? sansRecadrage;
  const hotspot = photo.hotspot ?? auCentre;

  // 1. Zone gardée par le recadrage manuel, en pixels.
  const zoneGauche = crop.left * photo.largeur;
  const zoneHaut = crop.top * photo.hauteur;
  const zoneLargeur = (1 - crop.left - crop.right) * photo.largeur;
  const zoneHauteur = (1 - crop.top - crop.bottom) * photo.hauteur;

  // 2. Plus grand rectangle au bon format qui tient dans cette zone.
  const format = largeur / hauteur;
  const rectLargeur = Math.min(zoneLargeur, zoneHauteur * format);
  const rectHauteur = rectLargeur / format;

  // 3. Centré sur la zone importante, sans sortir de la zone recadrée.
  const gauche = borner(hotspot.x * photo.largeur - rectLargeur / 2, zoneGauche, zoneGauche + zoneLargeur - rectLargeur);
  const haut = borner(hotspot.y * photo.hauteur - rectHauteur / 2, zoneHaut, zoneHaut + zoneHauteur - rectHauteur);

  const rect = [gauche, haut, rectLargeur, rectHauteur].map(Math.round).join(",");
  return `${photo.url}?rect=${rect}&w=${largeur}&h=${hauteur}`;
}

const echapper = (texte: string) =>
  texte
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function morceauEnHtml({ text, marks = [] }: Morceau): string {
  let html = echapper(text).replaceAll("\n", "<br>");
  if (marks.includes("em")) html = `<em>${html}</em>`;
  if (marks.includes("strong")) html = `<strong>${html}</strong>`;
  return html;
}

/**
 * Texte riche Sanity (« Portable Text ») → HTML. Limité à ce que le Studio
 * permet de saisir : paragraphes, intertitres, gras, italique.
 */
export function texteEnHtml(blocs: BlocSanity[]): string {
  return blocs
    .map((bloc) => {
      const balise = bloc.style === "h2" ? "h2" : "p";
      return `<${balise}>${bloc.children.map(morceauEnHtml).join("")}</${balise}>`;
    })
    .join("\n");
}

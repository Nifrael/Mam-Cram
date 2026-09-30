// ESSAI SANITY : copie les actualités Markdown du site dans Sanity (une seule fois).
//
//   node migration/actualites-markdown.mjs > migration/actualites.ndjson
//   npx sanity dataset import migration/actualites.ndjson production --replace
//
// Lecture volontairement simple du frontmatter : suffit pour nos 3 fichiers,
// pas pour du YAML quelconque.
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

const dossier = resolve(import.meta.dirname, "../../src/content/actualites");

const valeur = (frontmatter, cle) =>
  frontmatter
    .match(new RegExp(`^\\s*${cle}: (.*)$`, "m"))?.[1]
    .replace(/^"(.*)"$/, "$1")
    .trim();

const bloc = (texte, index) => ({
  _type: "block",
  _key: `b${index}`,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `s${index}`, text: texte, marks: [] }],
});

for (const fichier of readdirSync(dossier).filter((nom) => nom.endsWith(".md"))) {
  const chemin = resolve(dossier, fichier);
  const [, frontmatter, corps] = readFileSync(chemin, "utf8").split(/^---$/m);
  const slug = basename(fichier, ".md");
  const photo = resolve(dirname(chemin), valeur(frontmatter, "src"));

  const document = {
    _id: `actualite-${slug}`,
    _type: "actualite",
    titre: valeur(frontmatter, "titre"),
    slug: { _type: "slug", current: slug },
    date: valeur(frontmatter, "date"),
    resume: valeur(frontmatter, "resume"),
    // `_sanityAsset` : l'import envoie la photo dans Sanity et remplace ce champ par la référence.
    photo: { _type: "image", _sanityAsset: `image@file://${photo}`, alt: valeur(frontmatter, "alt") },
    texte: corps
      .trim()
      .split(/\n\s*\n/)
      .map((paragraphe, index) => bloc(paragraphe.trim(), index)),
  };

  console.log(JSON.stringify(document));
}

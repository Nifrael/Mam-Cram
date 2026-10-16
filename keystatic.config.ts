// ESSAI KEYSTATIC : interface d'édition des collections, en mode local.
// Keystatic lit et écrit directement les fichiers de src/content/ : ce fichier
// doit rester d'accord avec les schémas de src/content.config.ts.
import { collection, config, fields } from "@keystatic/core";

// Photo + texte alternatif. Keystatic range chaque photo dans un dossier au nom
// de la fiche, à côté d'elle (ex. src/content/objets/arbre-de-vie/photo-1.jpg),
// et écrit le chemin relatif que `image()` d'Astro sait optimiser.
const photo = (dossier: string) =>
  fields.object({
    src: fields.image({
      label: "Photo",
      directory: `src/content/${dossier}`,
      publicPath: "./",
      validation: { isRequired: true },
    }),
    alt: fields.text({
      label: "Description de la photo",
      description: "Ce que montre la photo, pour les personnes qui ne la voient pas (lecteurs d'écran, Google).",
      validation: { isRequired: true },
    }),
  });

const titreEtAdresse = fields.slug({
  name: { label: "Titre", validation: { isRequired: true } },
  slug: {
    label: "Adresse de la page",
    description: "Créée à partir du titre. À ne plus changer une fois en ligne : les liens partagés ne marcheraient plus.",
  },
});

export default config({
  storage: { kind: "local" },
  locale: "fr-FR",
  ui: { brand: { name: "MAM'CRAM" } },
  collections: {
    gammes: collection({
      label: "Gammes",
      path: "src/content/gammes/*",
      slugField: "titre",
      schema: {
        titre: titreEtAdresse,
        badge: fields.text({ label: "Badge", description: "Mot court affiché sur la carte (ex. « Saison »).", validation: { isRequired: true } }),
        description: fields.text({ label: "Description", multiline: true, validation: { isRequired: true } }),
        photo: photo("gammes"),
        ordre: fields.integer({ label: "Ordre d'affichage", description: "Les plus petits nombres s'affichent en premier.", validation: { isRequired: true } }),
        visible: fields.checkbox({ label: "Visible sur le site", description: "Décocher pour masquer une gamme saisonnière hors saison.", defaultValue: true }),
      },
    }),
    objets: collection({
      label: "Créations",
      path: "src/content/objets/*",
      slugField: "titre",
      schema: {
        titre: titreEtAdresse,
        gamme: fields.relationship({ label: "Gamme", collection: "gammes", validation: { isRequired: true } }),
        resume: fields.text({ label: "Résumé", multiline: true, validation: { isRequired: true } }),
        photos: fields.array(photo("objets"), {
          label: "Photos",
          description: "La première photo est celle de la carte.",
          itemLabel: (props) => props.fields.alt.value || "Photo",
          validation: { length: { min: 1 } },
        }),
        dimensions: fields.text({ label: "Dimensions", validation: { isRequired: true } }),
        matieres: fields.array(fields.text({ label: "Matière" }), { label: "Matières", itemLabel: (props) => props.value }),
        personnalisable: fields.checkbox({ label: "Personnalisable" }),
        misEnAvant: fields.checkbox({ label: "Mettre en avant", description: "Affichée en tête de sa gamme." }),
        statut: fields.select({
          label: "Statut",
          options: [
            { label: "Disponible", value: "disponible" },
            { label: "Sur commande", value: "sur-commande" },
            { label: "Épuisé", value: "epuise" },
          ],
          defaultValue: "disponible",
        }),
      },
    }),
    actualites: collection({
      label: "Actualités",
      path: "src/content/actualites/*",
      slugField: "titre",
      format: { contentField: "texte" },
      schema: {
        titre: titreEtAdresse,
        date: fields.date({ label: "Date de publication", defaultValue: { kind: "today" }, validation: { isRequired: true } }),
        resume: fields.text({ label: "Résumé", multiline: true, validation: { isRequired: true } }),
        photo: photo("actualites"),
        // Corps de l'article, gardé en .md. Mise en forme limitée à ce que le site affiche.
        texte: fields.markdoc({
          label: "Texte",
          extension: "md",
          options: { heading: [2], image: false, table: false, codeBlock: false, code: false, divider: false, blockquote: false, strikethrough: false },
        }),
      },
    }),
  },
});

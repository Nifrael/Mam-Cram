import { defineField, defineType } from "sanity";

// Même contenu que l'ancienne collection Markdown `actualites`
// (voir src/content.config.ts) : les deux doivent rester synchronisés.
export const actualite = defineType({
  name: "actualite",
  title: "Actualité",
  type: "document",
  fields: [
    defineField({
      name: "titre",
      title: "Titre",
      type: "string",
      validation: (regle) => regle.required(),
    }),
    defineField({
      name: "slug",
      title: "Adresse de la page",
      description: "Fabriquée à partir du titre : cliquez sur « Générer ».",
      type: "slug",
      options: { source: "titre" },
      validation: (regle) => regle.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "D MMMM YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (regle) => regle.required(),
    }),
    defineField({
      name: "resume",
      title: "Résumé",
      description: "Une ou deux phrases, affichées sur les cartes.",
      type: "text",
      rows: 3,
      validation: (regle) => regle.required().max(200),
    }),
    defineField({
      name: "photo",
      title: "Photo",
      description: "Cliquez sur le crayon pour choisir la zone importante de la photo : elle restera visible sur tous les formats.",
      type: "image",
      // hotspot : active le choix de la zone importante et du recadrage.
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Description de la photo",
          description: "Ce que montre la photo, pour les personnes qui ne la voient pas (lecteurs d'écran).",
          type: "string",
          validation: (regle) => regle.required(),
        }),
      ],
      validation: (regle) => regle.required(),
    }),
    defineField({
      name: "texte",
      title: "Texte de l'article",
      type: "array",
      // Éditeur de texte volontairement réduit : paragraphes, intertitres,
      // gras et italique. Rien que le site ne sache afficher.
      of: [
        {
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Intertitre", value: "h2" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [],
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Plus récentes d'abord",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "titre", subtitle: "date", media: "photo" },
  },
});

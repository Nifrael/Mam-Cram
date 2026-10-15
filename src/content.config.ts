import { defineCollection, reference, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const photo = (image: SchemaContext["image"]) =>
  z.object({
    src: image(),
    alt: z.string(),
  });

const gammes = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/gammes" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      badge: z.string(),
      description: z.string(),
      photo: photo(image),
      ordre: z.number(),
      visible: z.boolean().default(true),
    }),
});

const objets = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/objets" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      gamme: reference("gammes"),
      resume: z.string(),
      photos: z.array(photo(image)).min(1),
      dimensions: z.string(),
      matieres: z.array(z.string()),
      personnalisable: z.boolean().default(false),
      statut: z.enum(["disponible", "sur-commande", "epuise"]),
      prix: z.number().positive().optional(),
      lienStripe: z.url().optional(),
      misEnAvant: z.boolean().default(false),
    }),
});

// Le texte de l'article est le corps du fichier Markdown, sous le frontmatter.
const actualites = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/actualites" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      date: z.coerce.date(),
      resume: z.string(),
      photo: photo(image),
    }),
});

// Pages légales : un fichier Markdown par page, lu par la page du même nom
// dans src/pages/. Le texte est le corps Markdown.
const pagesLegales = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/pages-legales" }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    miseAJour: z.coerce.date(),
  }),
});

// Page « Notre histoire » : un seul fichier Markdown. Les champs alimentent l'en-tête
// de la page et ses balises SEO ; le corps Markdown en est le texte.
const histoire = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/histoire" }),
  schema: z.object({
    titre: z.string(),
    accent: z.string(),
    intro: z.string(),
    description: z.string(),
  }),
});

export const collections = { gammes, objets, actualites, pagesLegales, histoire };

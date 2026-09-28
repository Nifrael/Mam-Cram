import { defineCollection, reference, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const photo = (image: SchemaContext["image"]) =>
  z.object({
    src: image(),
    alt: z.string(),
  });

const gammes = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/gammes" }),
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
  loader: glob({ pattern: "*.md", base: "./src/content/objets" }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      gamme: reference("gammes"),
      resume: z.string(),
      photos: z.array(photo(image)).min(1),
      dimensions: z.string(),
      matieres: z.array(z.string()),
      personnalisable: z.boolean().default(false),
      pieceUnique: z.boolean().default(false),
      statut: z.enum(["disponible", "sur-commande", "epuise"]),
      prix: z.number().positive().optional(),
      lienStripe: z.url().optional(),
      misEnAvant: z.boolean().default(false),
    }),
});

export const collections = { gammes, objets };

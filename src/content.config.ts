import { defineCollection, reference, type SchemaContext } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SANITY_PROJET } from "astro:env/server";
import { texteEnHtml, urlPhotoRecadree, type BlocSanity, type PhotoSanity } from "@/lib/sanity";

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

// ESSAI SANITY : les actualités viennent de Sanity (dossier studio/), pas de
// fichiers Markdown. Même forme de données qu'avant, sauf la photo : une URL
// distante (optimisée par Astro au build) avec ses dimensions.
const REQUETE_ACTUALITES = `*[_type == "actualite" && defined(slug.current)]{
  titre,
  "slug": slug.current,
  date,
  resume,
  texte,
  "photo": {
    "url": photo.asset->url,
    "largeur": photo.asset->metadata.dimensions.width,
    "hauteur": photo.asset->metadata.dimensions.height,
    "alt": photo.alt,
    "crop": photo.crop,
    "hotspot": photo.hotspot
  }
}`;

type ActualiteSanity = {
  titre: string;
  slug: string;
  date: string;
  resume: string;
  texte: BlocSanity[] | null;
  photo: PhotoSanity;
};

// Format des photos d'actualité sur le site (cartes et article : 16/10).
const PHOTO_LARGEUR = 1600;
const PHOTO_HAUTEUR = 1000;

const actualites = defineCollection({
  loader: {
    name: "actualites-sanity",
    load: async ({ store, parseData, generateDigest }) => {
      // API HTTP de Sanity : un simple fetch, pas besoin de bibliothèque.
      const url = `https://${SANITY_PROJET}.api.sanity.io/v2025-02-19/data/query/production?query=${encodeURIComponent(REQUETE_ACTUALITES)}`;
      const reponse = await fetch(url);
      if (!reponse.ok) throw new Error(`Sanity a répondu ${reponse.status} : ${await reponse.text()}`);
      const { result } = (await reponse.json()) as { result: ActualiteSanity[] }; // forme garantie par la requête ci-dessus

      store.clear();
      for (const actualite of result) {
        const data = await parseData({
          id: actualite.slug,
          data: {
            titre: actualite.titre,
            date: actualite.date,
            resume: actualite.resume,
            photo: {
              src: urlPhotoRecadree(actualite.photo, PHOTO_LARGEUR, PHOTO_HAUTEUR),
              alt: actualite.photo.alt,
              largeur: PHOTO_LARGEUR,
              hauteur: PHOTO_HAUTEUR,
            },
          },
        });
        store.set({
          id: actualite.slug,
          data,
          // `rendered` permet de garder `render(actualite)` dans la page article.
          rendered: { html: texteEnHtml(actualite.texte ?? []) },
          digest: generateDigest(actualite),
        });
      }
    },
  },
  schema: z.object({
    titre: z.string(),
    date: z.coerce.date(),
    resume: z.string(),
    photo: z.object({
      src: z.url(),
      alt: z.string(),
      largeur: z.number(),
      hauteur: z.number(),
    }),
  }),
});

export const collections = { gammes, objets, actualites };

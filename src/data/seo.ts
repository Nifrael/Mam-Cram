import imageParDefaut from "@/assets/images/Hero.jpg";

export const nomDuSite = "MAM'CRAM";

/** Image de partage quand la page n'a pas la sienne. */
export const partageParDefaut = {
  src: imageParDefaut,
  alt: "Création en macramé et bois flotté de MAM'CRAM",
};

/** Format des images de partage (ratio 1,91:1 attendu par les réseaux). JPEG : WhatsApp et Facebook lisent mal le WebP. */
export const formatPartage = { width: 1200, height: 630, fit: "cover", format: "jpg" } as const;

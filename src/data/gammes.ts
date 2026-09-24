import photoProvisoire from "@/assets/images/Hero.jpg";

export type Gamme = {
  slug: string;
  badge: string;
  titre: string;
  description: string;
  photo: ImageMetadata;
  altPhoto: string;
};

export const gammes: Gamme[] = [
  {
    slug: "petites-douceurs",
    badge: "Cadeaux & Enfance",
    titre: "Petites Douceurs",
    description:
      "Porte-clés, anges, figurines, fleurs séchées et couronnes nominatives pour décorer avec délicatesse l'univers des tout-petits.",
    photo: photoProvisoire,
    altPhoto: "Anges et porte-clés en macramé suspendus à une branche de bois flotté",
  },
  {
    slug: "accessoires-et-utiles",
    badge: "Maison & Nomade",
    titre: "Accessoires & Utiles",
    description:
      "Sacs, porte-gourdes tressés, nichoirs poétiques et suspensions pour suspendre et sublimer vos plantes favorites dans l'habitat.",
    photo: photoProvisoire,
    altPhoto: "Sac et suspension pour plante en macramé",
  },
  {
    slug: "pieces-maitresses",
    badge: "Créations d'Art",
    titre: "Pièces Maîtresses",
    description:
      "Grandes étagères tressées, rideaux majestueux, hiboux sculptés, attrape-rêves et arbres de vie pour habiller vos grands volumes.",
    photo: photoProvisoire,
    altPhoto: "Grande tenture en macramé nouée sur une branche de bois flotté",
  },
];

// Données structurées (JSON-LD) : le même contenu que la page, écrit pour les moteurs
// de recherche (vocabulaire schema.org). Fonctions pures : elles reçoivent tout en
// paramètre, les pages et composants leur fournissent les valeurs.

export type JsonLd = Record<string, unknown>;

/** Regroupe plusieurs blocs schema.org dans un seul document JSON-LD. */
export function graphe(...noeuds: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": noeuds };
}

/** Texte à placer dans <script type="application/ld+json">. Le `<` est échappé : un `</script>` dans un texte fermerait la balise. */
export function versJsonLd(donnees: JsonLd): string {
  return JSON.stringify(donnees).replace(/</g, "\\u003c");
}

type EntrepriseParams = {
  nom: string;
  url: URL;
  description: string;
  email: string;
  reseaux: string[];
};

// Pas d'adresse postale (activité à domicile) : c'est donc une `Organization` et non
// un `LocalBusiness`, avec la France entière comme zone de vente.
export function entreprise({ nom, url, description, email, reseaux }: EntrepriseParams): JsonLd {
  return {
    "@type": "Organization",
    name: nom,
    url: url.href,
    description,
    email,
    areaServed: "FR",
    sameAs: reseaux,
  };
}

export function siteWeb({ nom, url }: Pick<EntrepriseParams, "nom" | "url">): JsonLd {
  return { "@type": "WebSite", name: nom, url: url.href, inLanguage: "fr-FR" };
}

type FilArianeParams = {
  parent: { nom: string; url: URL };
  courant: { nom: string; url: URL };
};

export function filAriane({ parent, courant }: FilArianeParams): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [parent, courant].map(({ nom, url }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: nom,
      item: url.href,
    })),
  };
}

type ArticleParams = {
  titre: string;
  description: string;
  url: URL;
  datePublication: Date;
  image: string;
  editeur: { nom: string; url: URL };
};

export function article({ titre, description, url, datePublication, image, editeur }: ArticleParams): JsonLd {
  const organisation = { "@type": "Organization", name: editeur.nom, url: editeur.url.href };
  return {
    "@type": "Article",
    headline: titre,
    description,
    image: [image],
    datePublished: datePublication.toISOString(),
    mainEntityOfPage: url.href,
    author: organisation,
    publisher: organisation,
  };
}

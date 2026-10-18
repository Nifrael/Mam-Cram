import type { APIRoute } from "astro";
import { INDEXATION } from "astro:env/server";

// Généré au build plutôt que stocké dans public/ : son contenu dépend de INDEXATION.
export const GET: APIRoute = ({ site }) => {
  // L'interface d'édition n'a rien à faire dans Google, même site indexé.
  const lignes = INDEXATION
    ? [
        "User-agent: *",
        "Allow: /",
        "Disallow: /keystatic/",
        "Disallow: /api/keystatic/",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", site)}`,
      ]
    : ["User-agent: *", "Disallow: /"];

  return new Response(lignes.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

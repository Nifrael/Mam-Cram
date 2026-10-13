import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
    dataset: "production",
  },
  // Adresse du Studio en ligne : https://mamcram.sanity.studio
  studioHost: "mamcram",
  // Identifiant du Studio déployé : évite la question à chaque `sanity deploy`.
  deployment: { appId: "cc81pputz95wwcs8vppvmjh2" },
});

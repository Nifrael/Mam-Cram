import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
    dataset: "production",
  },
  // Adresse du Studio en ligne : https://mamcram.sanity.studio
  studioHost: "mamcram",
});

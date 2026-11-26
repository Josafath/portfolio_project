import { existsSync } from "node:fs";
import type { NextConfig } from "next";

// Drop a CV in public/cv/ and the hero shows a download button for it (see src/lib/cv.ts)
const cvLanguages = ["es", "en"].filter((lang) => existsSync(`public/cv/josafath-ceron-cv-${lang}.pdf`));

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_CV_LANGUAGES: cvLanguages.join(",") },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { NextConfig } from "next";
import { basePath } from "./src/config/paths";

const useRelativeAssets = process.env.NEXT_PUBLIC_RELATIVE_ASSETS === "true";

const nextConfig: NextConfig = {
  output: "export",
  // Cloud exports use relative URLs so the folder can be copied to any subdirectory.
  basePath,
  ...(useRelativeAssets ? { assetPrefix: "./" } : {}),
  images: {
    unoptimized: true,
  },
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

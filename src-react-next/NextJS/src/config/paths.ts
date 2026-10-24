// Next.js inlines these values at build time. Development stays at the domain
// root. Cloud exports use relative URLs so they work from any Apache subfolder.
const useRelativeAssets = process.env.NEXT_PUBLIC_RELATIVE_ASSETS === "true";

export const basePath =
  process.env.NODE_ENV === "production"
    ? useRelativeAssets
      ? ""
      : (process.env.NEXT_PUBLIC_BASE_PATH ?? "/servicehp/out")
    : "";

export function publicAssetPath(path: string) {
  if (useRelativeAssets) return `.${path}`;
  return `${basePath}${path}`;
}

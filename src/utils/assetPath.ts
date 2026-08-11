/// <reference types="vite/client" />

/**
 * Resolves a public asset path using the Vite base URL.
 * This ensures assets work correctly when deployed under a subpath (e.g., /val/).
 */
export function assetPath(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}

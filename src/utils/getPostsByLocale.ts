import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

function getPostLang(post: CollectionEntry<"posts">): string {
  return (post.data as { lang?: string }).lang ?? "zh";
}

/**
 * Extract the base slug from a post ID.
 * Post IDs look like "zh/my-post" or "en/my-post" or just "my-post".
 */
export function getPostBaseId(id: string): string {
  const parts = id.split("/");
  if (parts.length >= 2 && (parts[0] === "zh" || parts[0] === "en")) {
    return parts.slice(1).join("/");
  }
  return id;
}

export function getPostSlugFromId(id: string): string {
  const baseId = getPostBaseId(id);
  return slugifyStr(baseId);
}

/**
 * Given a locale and all posts, return posts for that locale.
 * If a post doesn't exist in the requested locale, fall back to the default locale.
 */
export function getPostsByLocale(
  posts: CollectionEntry<"posts">[],
  locale: string
): CollectionEntry<"posts">[] {
  const defaultLocale = "zh";

  // Group posts by their base slug
  const grouped = new Map<string, CollectionEntry<"posts">[]>();
  for (const post of posts) {
    const baseId = getPostBaseId(post.id);
    const existing = grouped.get(baseId) ?? [];
    existing.push(post);
    grouped.set(baseId, existing);
  }

  const result: CollectionEntry<"posts">[] = [];

  for (const [, versions] of grouped) {
    // Prefer the requested locale, fall back to default locale, then any available
    const preferred = versions.find(p => getPostLang(p) === locale);
    const fallback = versions.find(p => getPostLang(p) === defaultLocale);
    result.push(preferred ?? fallback ?? versions[0]);
  }

  return result;
}

/**
 * Get all unique base slugs (deduplicated across locales).
 */
export function getUniqueBaseSlugs(
  posts: CollectionEntry<"posts">[]
): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const post of posts) {
    const baseId = getPostBaseId(post.id);
    if (!seen.has(baseId)) {
      seen.add(baseId);
      slugs.push(baseId);
    }
  }
  return slugs;
}

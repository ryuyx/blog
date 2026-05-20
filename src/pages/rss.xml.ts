import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { getPostsByLocale } from "@/utils/getPostsByLocale";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const localePosts = getPostsByLocale(posts, "zh");
  const sortedPosts = getSortedPosts(localePosts);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items: sortedPosts.map(({ data, id, filePath }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}

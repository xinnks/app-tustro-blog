import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { client } from '../lib/tursoDb';
import type { APIContext } from 'astro';
import type { Blog } from '../lib/types';


export async function get(context: APIContext) {
  let posts: Blog[] = [];
  const response = await fetch(context.site + 'all-posts.json');
  posts = await response.json() as unknown as Blog[];

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site as unknown as string,
    items: posts.map((post) => ({
      title: post.title,
      pubDate: new Date((post.publish_date || post.created_at) * 1000),
      description: post.description,
      link: `/post/${post.slug}/`,
    })),
  });
}

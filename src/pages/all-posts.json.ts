import { client } from "../lib/tursoDb";
import type { Blog } from "../lib/types";

export async function get() {
  let posts: Blog[] = [];
  try {
    const allPostsResponse = await client.execute("select posts.title, posts.description, posts.slug, posts.hero, authors.first_name, authors.last_name, authors.slug as author_slug, authors.avatar, posts.content, posts.created_at from posts left join authors on authors.id = posts.author_id order by posts.created_at desc;");
    const allPosts = allPostsResponse.rows;
    posts = allPosts.map((post: any): Blog => {
      return {
        published: false,
        title: post.title,
        description: post.description,
        slug: post.slug,
        hero: post.hero,
        created_at: post.created_at,
        author: {
          first_name: post.first_name,
          last_name: post.last_name,
          slug: post.slug,
          avatar: post.avatar
        }
      }
    });
    return new Response(JSON.stringify(posts, null), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 404,
      statusText: 'Not found'
    });
  }
}
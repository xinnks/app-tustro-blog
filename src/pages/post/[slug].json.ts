import { client } from "../../lib/tursoDb";
import type { Blog } from "../../lib/types";

export async function get({ params }: {params: any}) {
  const { slug } = params;
  let post: Blog | null = null;

  if(!slug){
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }

  try {
    const postResponse = await client.execute({
      sql: "select posts.content, posts.published, posts.title, posts.description, posts.slug, posts.hero, posts.created_at, authors.first_name, authors.last_name, authors.slug, authors.avatar, authors.twitter from posts left join authors on authors.id = posts.author_id where posts.slug = ?;",
      args: [slug as string],
    });
    if(!postResponse.rows.length){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }
    const blogPostData = postResponse.rows[0] as any;
    if(!blogPostData){
      return new Response(null, {
        status: 404,
        statusText: 'Not found'
      });
    }

    post = {
      content: blogPostData.content,
      published: blogPostData.published,
      title: blogPostData.title,
      description: blogPostData.description,
      slug: blogPostData.slug,
      hero: blogPostData.hero,
      created_at: blogPostData.created_at,
      author: {
        first_name: blogPostData.first_name,
        last_name: blogPostData.last_name,
        slug: blogPostData.slug,
        avatar: blogPostData.avatar,
        email: blogPostData.email,
        socials: {
          twitter: blogPostData.twitter
        },
        created_at: blogPostData.created_at
      }
    };
    return new Response(JSON.stringify(post), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      statusText: 'Not found'
    });
  }
}
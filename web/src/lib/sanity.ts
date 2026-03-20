import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "npzanja1",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export const POSTS_QUERY = `*[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  "author": author->name,
  "categories": categories[]->title
}`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  slug,
  excerpt,
  publishedAt,
  coverImage,
  body,
  "author": author->{name, image, bio},
  "categories": categories[]->title
}`;

export const POSTS_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`;

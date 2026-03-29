import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor, POSTS_QUERY } from "@/lib/sanity";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

export const metadata: Metadata = {
  title: "Blog — mukoko",
  description:
    "Stories, updates, and thinking from the mukoko team. Building digital infrastructure for African community life.",
  openGraph: {
    title: "Blog — mukoko",
    description:
      "Stories, updates, and thinking from the mukoko team.",
    type: "website",
    url: "https://mukoko.com/blog",
  },
};

interface Post {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  coverImage?: { asset: { _ref: string }; alt?: string };
  author: string;
  categories: string[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const revalidate = 60;

export default async function BlogPage() {
  const posts: Post[] = await client.fetch(POSTS_QUERY);

  return (
    <>
      <Header />
      <main id="main-content" className="content-area">
        <div className="blog-header">
          <p className="content-section__number">mukoko</p>
          <h1 className="content-section__title">Blog</h1>
        </div>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <p className="body-large">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="blog-list">
            {posts.map((post) => (
              <article key={post.slug.current} className="blog-card">
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="blog-card__link"
                >
                  {post.coverImage?.asset && (
                    <div className="blog-card__image-wrap">
                      <Image
                        src={urlFor(post.coverImage)
                          .width(720)
                          .height(400)
                          .format("webp")
                          .url()}
                        alt={post.coverImage.alt || post.title}
                        width={720}
                        height={400}
                        className="blog-card__image"
                      />
                    </div>
                  )}
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <time dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                      {post.categories?.length > 0 && (
                        <>
                          <span className="blog-card__dot" aria-hidden="true">
                            ·
                          </span>
                          <span>{post.categories[0]}</span>
                        </>
                      )}
                    </div>
                    <h2 className="blog-card__title">{post.title}</h2>
                    {post.excerpt && (
                      <p className="blog-card__excerpt">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

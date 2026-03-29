import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client, urlFor, POST_QUERY, POSTS_SLUGS_QUERY } from "@/lib/sanity";
import { Header } from "@/components/Header";
import { Footer } from "@/sections/Footer";

interface Post {
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  coverImage?: { asset: { _ref: string }; alt?: string };
  body: Parameters<typeof PortableText>[0]["value"];
  author: { name: string; image?: { asset: { _ref: string } }; bio?: string };
  categories: string[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="blog-body__h2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="blog-body__h3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="blog-body__h4">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="pull-quote"><p>{children}</p></blockquote>
    ),
    normal: ({ children }) => (
      <p className="blog-body__p">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="blog-body__inline-code">{children}</code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="blog-body__list">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="blog-body__list">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="blog-body__li">{children}</li>,
    number: ({ children }) => <li className="blog-body__li">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="blog-body__figure">
          <Image
            src={urlFor(value).width(960).format("webp").url()}
            alt={value.alt || ""}
            width={960}
            height={540}
            className="blog-body__img"
          />
          {value.caption && (
            <figcaption className="blog-body__caption">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(POSTS_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post: Post | null = await client.fetch(POST_QUERY, { slug });
  if (!post) return { title: "Post not found — mukoko" };

  return {
    title: `${post.title} — mukoko`,
    description: post.excerpt || `Read "${post.title}" on the mukoko blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      url: `https://mukoko.com/blog/${slug}`,
      ...(post.coverImage?.asset && {
        images: [
          {
            url: urlFor(post.coverImage).width(1200).height(630).url(),
            width: 1200,
            height: 630,
          },
        ],
      }),
    },
  };
}

export const revalidate = 60;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post | null = await client.fetch(POST_QUERY, { slug });

  if (!post) notFound();

  return (
    <>
      <Header />
      <main id="main-content" className="content-area">
        {/* Header */}
        <header className="blog-post-header">
          <Link href="/blog" className="back-link">
            ← Blog
          </Link>

          <div className="blog-card__meta">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
            {post.categories?.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.categories.join(", ")}</span>
              </>
            )}
          </div>

          <h1 className="content-section__title">{post.title}</h1>

          {post.excerpt && (
            <p className="body-large">{post.excerpt}</p>
          )}

          {post.author && (
            <div className="blog-author">
              {post.author.image?.asset && (
                <Image
                  src={urlFor(post.author.image)
                    .width(48)
                    .height(48)
                    .format("webp")
                    .url()}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="blog-author__img"
                />
              )}
              <span className="blog-author__name">
                {post.author.name}
              </span>
            </div>
          )}
        </header>

        {/* Cover image */}
        {post.coverImage?.asset && (
          <div className="blog-cover">
            <Image
              src={urlFor(post.coverImage)
                .width(960)
                .height(540)
                .format("webp")
                .url()}
              alt={post.coverImage.alt || post.title}
              width={960}
              height={540}
              className="blog-cover__img"
              priority
            />
          </div>
        )}

        {/* Body */}
        <article className="blog-body">
          {post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </article>

        {/* Footer nav */}
        <div className="blog-footer-nav">
          <Link href="/blog" className="back-link">
            ← All posts
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

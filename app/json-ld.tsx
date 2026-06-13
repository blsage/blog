import { site } from "@/site.config";
import type { Post } from "./get-posts";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const person = {
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: site.jobTitle,
  sameAs: site.sameAs,
};

export function HomeJsonLd() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", ...person }} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
          author: person,
        }}
      />
    </>
  );
}

export function ArticleJsonLd({ post }: { post: Post }) {
  const url = `${site.url}/${post.id}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        datePublished: post.date,
        dateModified: post.date,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: person,
        publisher: person,
      }}
    />
  );
}

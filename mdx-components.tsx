import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function CustomLink({
  href = "",
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function CustomImage({
  title,
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="img-figure">
      <span className="img-frame">
        <img loading="lazy" decoding="async" alt={alt} {...props} />
      </span>
      {title && <span className="caption">{title}</span>}
    </span>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: CustomLink,
    img: CustomImage,
    ...components,
  };
}

# Blog

Personal blog modeled on rauchg/blog's architecture with benji.org's aesthetic and content style.

## Architecture (decided — see research below)

- **Next.js App Router** (latest), TypeScript, pnpm
- **MDX-as-routes** via `@next/mdx`: each post is `app/(articles)/<slug>/page.mdx` inside an `(articles)` route group with a shared `layout.tsx`. No CMS, no content loader, no frontmatter parsing.
- `pageExtensions: ["ts", "tsx", "md", "mdx"]` in next.config
- **`mdxRs: false`** — use the JS MDX pipeline so rehype plugins work (this was the one friction point identified; mdxRs doesn't support remark/rehype plugins)
- **rehype-pretty-code** (Shiki) for code blocks — benji.org-style
- **Post registry**: hand-maintained `app/posts.json` (`id`, `date`, `title`) + `get-posts.ts` that drives the homepage index
- **`mdx-components.ts`** maps markdown elements (h1/a/img/code/footnotes) to custom React components; posts can import arbitrary client components inline for interactive demos
- **Styling**: CSS Modules + handwritten plain CSS (benji.org approach) — NOT Tailwind. Centered ~36rem column, fixed top fade gradient (`position:fixed` white→transparent gradient overlay at top of viewport).
- **Framer Motion** for animation
- Self-hosted fonts via `next/font`
- Optional/later: Upstash Redis view counters (HSET "views", merged in get-posts.ts like rauchg), `app/atom/route.ts` feed, dynamic OG images via `opengraph-image`

## Reference: how the two source sites work

**rauchg/blog** (github.com/rauchg/blog): @next/mdx, posts in `app/(post)/<year>/<slug>/page.mdx`, `posts.json` registry, Upstash Redis views, react-tweet/react-youtube embeds, Tailwind, Geist, Vercel Analytics, Atom feed, OG image gen.

**benji.org** (Benji Taylor): Next.js App Router on Netlify, `app/(articles)/<slug>` route group, MDX with rehype-pretty-code, CSS Modules + plain CSS, Framer Motion, next/font self-hosted, bespoke interactive demo components embedded in articles, no CMS/analytics/RSS. Articles live at root paths (benji.org/agentation).

## Conventions

- Posts live at root paths: `/my-post-slug`, not `/blog/...`
- Curly quotes in all user-facing copy
- No internal code comments; self-documenting naming

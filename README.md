# blog

A minimal personal blog where every post is an MDX file that is its own route. No CMS, no database, no frontmatter parsing.

Built with Next.js (App Router), TypeScript, `@next/mdx`, rehype-pretty-code (Shiki), CSS Modules + plain CSS, and Framer Motion.

## Make it yours

Everything personal lives in three places:

1. **`site.config.ts`** — your name, description, URL, email, location (drives the footer clock), and the “Updated” date on the homepage.
2. **`app/bio.mdx`** — the homepage bio. Plain markdown; links and emphasis are styled automatically.
3. **`app/posts.json`** — the post registry that drives the homepage index. One entry per post: `id` (the URL slug), `date` (`YYYY-MM-DD`), `title`.

## Writing a post

1. Create `app/(articles)/<slug>/page.mdx`:

   ```mdx
   export const metadata = {
     title: "My post title",
     description: "One-line summary.",
   };

   First paragraph...
   ```

2. Add the post to `app/posts.json`.

That’s it — the post is live at `/<slug>`, with the shared article layout (title, date, back link) applied automatically.

Posts are real React routes, so they can import client components for interactive demos:

```mdx
import { Demo } from "./demo";

<Demo />
```

Co-locate the component (and its CSS module) in the post’s folder. See `app/(articles)/building-this-blog/` for a working example with a highlighted code block and a Framer Motion component.

## Running

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build (fully static)
```

## How it works

- `@next/mdx` with `pageExtensions` including `mdx` makes each `page.mdx` a route. The JS MDX pipeline (`mdxRs: false`) is used so rehype plugins work.
- `rehype-pretty-code` highlights code blocks at build time with Shiki (`github-light`), styled with line numbers in `app/globals.css`.
- `mdx-components.tsx` maps markdown elements to custom components (external links open in a new tab, internal links use `next/link`).
- The article layout (`app/(articles)/layout.tsx`) reads the title and date for the current slug from the registry, so posts never repeat their own metadata.
- Typography, the centered column, and the fixed top fade gradient are handwritten CSS in `app/globals.css` — no Tailwind.

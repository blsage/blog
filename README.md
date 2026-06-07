# taylor-made

A minimal personal blog where every post is an MDX file that is its own route. No CMS, no database, no frontmatter parsing.

The name credits [Benji Taylor](https://benji.org) — the design is closely modeled on his site, and the MDX-as-routes architecture follows [rauchg/blog](https://github.com/rauchg/blog).

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

## Writing elements

Everything below is styled out of the box — plain markdown or plain HTML, no imports needed. `building-this-blog` demonstrates all of them live.

| Element | How |
| --- | --- |
| Emphasis / strong | `*emphasis*` sets in Newsreader italic; `**strong**` stays Inter |
| Sections | `##` headings get hairline leaders and populate the article’s index tree; `###` for subsections |
| Links | `[text](url)` — internal paths use the router, external URLs open in a new tab |
| Inline code | `` `code` `` with a quiet background tint |
| Code blocks | Fenced with a language tag for Shiki highlighting and line numbers; add `title="file.ts"` after the language for a filename label, `caption="…"` for a caption below |
| Blockquotes | `> quote` — italic with a hairline bar on the left |
| Lists | `-` and `1.` with hanging markers in the margin |
| Images | `![alt](src)` — rounded corners, lazy-loaded; `![alt](src "Caption")` adds a centered caption |
| Dividers | `---` renders as a hairline; `<hr data-variant="dots" />` for three centered dots, `data-variant="dashed"` for a dashed line |
| Pull quotes | `<div className="notation"><p>Quote.</p><span className="note">margin note</span></div>` — centered gray statement with a handwritten note in the right margin (stacks below on small screens) |
| Margin notes | `<MarginNote note="just because"><p>Paragraph…</p></MarginNote>` (from `@/app/components/margin-note`) — a rough-notation hand-drawn bracket sketches itself in when scrolled into view, with the handwritten note fading in beside it |
| Footnotes | `[^1]` in text, `[^1]: note` anywhere below — collected at the bottom under a short rule, click to return; external links inside get a box-arrow icon |
| Highlights | `<mark>text</mark>` for the flat yellow marker; `<Highlight>text</Highlight>` (from `@/app/components/highlight`) for realistic ink strokes — angled gradient, uneven edges, denser ink at the ends; `color` accepts `blue`/`pink`/`yellow`/`green` or any CSS color |
| Capsules | `<kbd>Continue</kbd>` — a rounded outline around inline words, for UI button labels |
| Definition lists | `<dl><dt>term</dt><dd>description</dd></dl>` — leader lines connect terms to right-aligned descriptions |
| CTA cards | `<a className="cta" href="…">Primary text. <span>Secondary action.</span></a>` — full-width gray card with an ↗ arrow, for end-of-post calls to action |
| Prompt boxes | `<aside className="prompt">…</aside>` — dashed rounded box in serif italic, for quoting prompts; add `data-label="Prompt Example"` for a yellow corner tag |
| Acknowledgements | A `<footer>` at the end of the post with `# Acknowledgements` and paragraphs — small gray type |
| Videos | `import { Video } from "@/app/components/video"` then `<Video src="/demo.mp4" caption="…" />` — framed card, loops muted, 1x/0.5x speed toggle in the top right |
| Interactive demos | Import any client component and place it inline; wrap in `<figure>` with a `<figcaption>` for a caption |

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

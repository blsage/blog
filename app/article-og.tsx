import { ImageResponse } from "next/og";
import { site } from "@/site.config";
import { getPosts, formatArticleDate } from "./get-posts";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

function postFor(slug: string) {
  return getPosts().find((post) => post.id === slug);
}

export function ogAlt(slug: string): string {
  return postFor(slug)?.title ?? site.name;
}

export function articleOgImage(slug: string) {
  const post = postFor(slug);
  const title = post?.title ?? site.name;
  const date = post ? formatArticleDate(post.date) : "";
  const titleSize = title.length > 24 ? 76 : title.length > 16 ? 88 : 104;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fdfdfc",
          color: "#111",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#111",
            }}
          />
          <span style={{ fontSize: 30, color: "rgba(0, 0, 0, 0.4)" }}>
            {date}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 30,
            color: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <span>{site.name}</span>
          <span
            style={{
              height: 6,
              flex: 1,
              margin: "0 32px",
              background: "#ffdc00",
              borderRadius: 3,
            }}
          />
          <span>{site.listTitle}</span>
        </div>
      </div>
    ),
    ogSize
  );
}

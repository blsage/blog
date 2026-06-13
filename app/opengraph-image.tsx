import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function OpengraphImage() {
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
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#111",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, letterSpacing: -2 }}>
            {site.name}
          </div>
          <div
            style={{
              fontSize: 36,
              marginTop: 12,
              color: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {site.description}
          </div>
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
          <span>{site.url.replace(/^https?:\/\//, "")}</span>
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
    size
  );
}

import { ImageResponse } from "next/og";
import { site } from "@/site.config";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#fdfdfc",
          borderRadius: 14,
          fontSize: 38,
          fontWeight: 600,
        }}
      >
        {site.name.charAt(0)}
      </div>
    ),
    size
  );
}

import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #18181b 100%)",
          color: "#fafafa",
          padding: 64,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 88,
            marginBottom: 24,
          }}
        >
          💬
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          {siteConfig.shortTitle}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#d4d4d8",
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          Збережіть гармонію в домі. Оберіть відповідь обережно.
        </div>
      </div>
    ),
    { ...size },
  );
}

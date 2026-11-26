import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Josafath Cerón";

/** The preview LinkedIn, WhatsApp and search engines show for a shared link. */
export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : "es");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0b0f14", color: "#e8ecf1" }}>
        <div style={{ display: "flex", fontSize: 34, fontFamily: "monospace" }}>
          <span>josafath</span>
          <span style={{ color: "#f5b94a" }}>.</span>
          <span>dev</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 108, fontWeight: 800, letterSpacing: -3 }}>Josafath Cerón</div>
          <div style={{ fontSize: 40, color: "#9aa4b2", maxWidth: 980 }}>{dict.meta.description}</div>
        </div>
        <div style={{ display: "flex", width: 140, height: 12, borderRadius: 6, background: "#f5b94a" }} />
      </div>
    ),
    size,
  );
}

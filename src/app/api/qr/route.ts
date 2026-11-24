import QRCode from "qrcode";
import { SITE_URL } from "@/lib/utils";

/** PNG QR code for a Sílaba path: /api/qr?p=/maria-vargas/estrategia */
export async function GET(request: Request) {
  const p = new URL(request.url).searchParams.get("p") ?? "/";
  if (!p.startsWith("/") || p.startsWith("//") || p.length > 200) return new Response("Ruta no válida", { status: 400 });
  const png = await QRCode.toBuffer(`${SITE_URL}${p}`, { width: 1024, margin: 2, color: { dark: "#13294B", light: "#FFFFFF" } });
  const name = p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "silaba";
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${name}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}

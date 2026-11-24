import QRCode from "qrcode";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://silaba.io").replace(/\/$/, "");

/** "Gestión de Proyectos" -> "gestion-de-proyectos" */
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Extracts a DOI from a raw DOI or a doi.org link. */
export function extractDoi(input: string): string | null {
  const m = input.trim().match(/10\.\d{4,9}\/[^\s"<>]+/i);
  return m ? m[0].replace(/[.,;)]+$/, "") : null;
}

/** Returns an embeddable URL for YouTube or Vimeo links, else null. */
export function videoEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export function isVideoUrl(url: string) {
  return videoEmbedUrl(url) !== null;
}

/** SVG markup for a QR code pointing to the given URL. */
export async function qrSvg(url: string) {
  return QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#13294B", light: "#FFFFFF" }, errorCorrectionLevel: "M" });
}

export type DoiInfo = { title: string; authors: string | null; year: number | null; source: string | null; open: boolean | null; url: string };

/** Looks up a DOI in OpenAlex (free API key: OPENALEX_API_KEY). */
export async function lookupDoi(doi: string): Promise<DoiInfo | null> {
  const key = process.env.OPENALEX_API_KEY;
  const url = `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}${key ? `?api_key=${key}` : ""}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "silaba.io" }, cache: "no-store" });
    if (!res.ok) return null;
    const w = await res.json();
    const authors: string[] = (w.authorships ?? []).slice(0, 4).map((a: { author?: { display_name?: string } }) => a.author?.display_name).filter(Boolean);
    return {
      title: w.display_name ?? w.title ?? doi,
      authors: authors.length ? authors.join(", ") + ((w.authorships?.length ?? 0) > 4 ? " et al." : "") : null,
      year: w.publication_year ?? null,
      source: w.primary_location?.source?.display_name ?? null,
      open: typeof w.open_access?.is_oa === "boolean" ? w.open_access.is_oa : null,
      url: w.open_access?.oa_url || `https://doi.org/${doi}`,
    };
  } catch {
    return null;
  }
}

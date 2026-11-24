import Link from "next/link";
import { qrSvg } from "@/lib/utils";

/** Wordmark "sí·la·ba" with gold syllable dots. */
export function Logo({ className = "", light = false, size = 26 }: { className?: string; light?: boolean; size?: number }) {
  return (
    <Link
      href="/"
      className={`font-serif font-semibold no-underline tracking-tight ${className}`}
      style={{ fontSize: size, color: light ? "#fff" : "var(--color-navy-900)" }}
      aria-label="Sílaba, inicio"
    >
      sí<span className="text-gold-500">·</span>la<span className="text-gold-500">·</span>ba
    </Link>
  );
}

/** Rotating gold seal used in the hero. Decorative. */
export function Seal({ size = 320 }: { size?: number }) {
  return (
    <svg className="spin" width={size} height={size} viewBox="0 0 320 320" aria-hidden="true">
      <defs>
        <path id="seal-ring" d="M160,160 m-122,0 a122,122 0 1,1 244,0 a122,122 0 1,1 -244,0" />
      </defs>
      <circle cx="160" cy="160" r="152" fill="none" stroke="#C9A24A" strokeWidth="1.5" />
      <circle cx="160" cy="160" r="142" fill="none" stroke="#C9A24A" strokeWidth="0.75" />
      <circle cx="160" cy="160" r="100" fill="none" stroke="#C9A24A" strokeWidth="0.75" />
      <text fill="#C9A24A" fontFamily="Inter, sans-serif" fontSize="15" fontWeight="600" letterSpacing="5">
        <textPath href="#seal-ring">SÍLABA · REÚNE · DESARROLLA · COMPARTE · </textPath>
      </text>
      <text x="160" y="176" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontSize="58" fontWeight="600">
        s<tspan fill="#C9A24A">·</tspan>
      </text>
    </svg>
  );
}

/** Server-rendered QR code (real, scannable). */
export async function QrCode({ url, size = 128, label }: { url: string; size?: number; label: string }) {
  const svg = await qrSvg(url);
  return (
    <div
      role="img"
      aria-label={label}
      className="shrink-0 border border-line bg-white [&>svg]:h-full [&>svg]:w-full"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function PublicHeader() {
  return (
    <header className="border-b border-gold-500/40 bg-navy-900">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-4 px-6 py-3">
        <Logo light size={23} className="grow" />
        <span className="text-sm text-mist">¿Enseñas?</span>
        <Link href="/entrar" className="btn btn-gold btn-sm">Crea tu espacio gratis</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-[#A9B6CB]">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-7 px-6 py-10 text-sm">
        <span className="font-serif text-[22px] font-semibold text-white">
          sí<span className="text-gold-500">·</span>la<span className="text-gold-500">·</span>ba
        </span>
        <span className="grow">Hecho en Costa Rica para América Latina</span>
        <a href="mailto:hola@silaba.io" className="nl">Contacto</a>
        <Link href="/terminos" className="nl">Términos y derechos de autor</Link>
      </div>
    </footer>
  );
}

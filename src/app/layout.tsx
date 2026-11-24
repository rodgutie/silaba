import type { Metadata } from "next";
// Self-hosted fonts (no request to Google at build time or for visitors).
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/source-serif-4/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://silaba.io"),
  title: { default: "Sílaba — lo que lees, piensas y enseñas, en un solo lugar", template: "%s · Sílaba" },
  description:
    "Espacio propio para docentes y educadores: reúne tus recursos, desarrolla tus líneas temáticas y comparte tus cursos con un enlace o un código QR.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

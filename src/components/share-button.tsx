"use client";

import { useState } from "react";

/** Copies a URL (or opens the native share sheet on phones). */
export default function ShareButton({ url, label = "Compartir", className = "btn btn-line" }: { url: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  async function share() {
    try {
      if (navigator.share && /Mobi/i.test(navigator.userAgent)) {
        await navigator.share({ url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* user cancelled */
    }
  }
  return (
    <button type="button" onClick={share} className={className}>
      {done ? "¡Enlace copiado!" : label}
    </button>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ handle }: { handle: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const next = handle ? `/panel/perfil?handle=${encodeURIComponent(handle)}` : "/panel";
  const redirectTo = () => `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function oauth(provider: "google" | "azure") {
    await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: redirectTo(), scopes: provider === "azure" ? "email" : undefined },
    });
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-line bg-ivory p-5">
        <p className="m-0 font-serif text-xl font-semibold">Revisa tu correo</p>
        <p className="mb-0 mt-1 text-muted">Te enviamos un enlace a <b>{email}</b>. Ábrelo en este dispositivo para entrar.</p>
      </div>
    );
  }

  return (
    <>
      <button type="button" onClick={() => oauth("google")} className="btn btn-line min-h-[50px]">Continuar con Google</button>
      <button type="button" onClick={() => oauth("azure")} className="btn btn-line min-h-[50px]">Continuar con Microsoft</button>
      <p className="-mt-1.5 mb-0 text-center text-[13px] text-muted">Funciona con tu correo institucional</p>
      <div className="flex items-center gap-3 text-sm text-muted">
        <span className="h-px grow bg-line" />o con tu correo<span className="h-px grow bg-line" />
      </div>
      <form onSubmit={magicLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="label mb-0">Correo electrónico</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@institucion.edu" className="field" />
        <button className="btn btn-navy min-h-[52px]" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviarme un enlace de acceso"}
        </button>
        {status === "error" && <p role="alert" className="m-0 text-sm text-warn">No pudimos enviar el correo. Revisa la dirección e intenta de nuevo.</p>}
        <p className="m-0 text-center text-[13px] text-muted">Sin contraseñas. Al continuar aceptas los <Link href="/terminos">Términos</Link>.</p>
      </form>
    </>
  );
}

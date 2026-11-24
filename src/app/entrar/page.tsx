import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand";
import { getUser } from "@/lib/supabase/server";
import LoginForm from "./login-form";

export const metadata: Metadata = { title: "Entrar o crear cuenta" };

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ handle?: string; error?: string }> }) {
  const { user } = await getUser();
  if (user) redirect("/panel");
  const { handle, error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-wrap bg-white">
      <div className="flex min-w-0 flex-[1_1_520px] flex-col px-6 py-10">
        <div className="mx-auto w-full max-w-[420px]"><Logo size={24} /></div>
        <div className="m-auto flex w-full max-w-[420px] flex-col gap-4 py-10">
          <h1 className="mb-0 mt-2 font-serif text-[32px] font-medium leading-tight">Crea tu espacio o entra</h1>
          <p className="m-0 text-muted">Gratis para siempre: perfil, un curso y tus líneas temáticas.</p>
          {error && <p role="alert" className="m-0 rounded bg-warn-bg px-3 py-2 text-sm text-warn">No pudimos iniciar sesión. Intenta de nuevo.</p>}
          <LoginForm handle={handle ?? ""} />
        </div>
      </div>
      <aside className="dg flex min-w-0 flex-[1_1_420px] flex-col justify-center gap-7 bg-navy-900 px-12 py-14 text-white">
        <h2 className="m-0 max-w-[440px] font-serif text-[32px] font-medium leading-tight">Tu espacio, listo en minutos</h2>
        <ol className="m-0 flex max-w-[440px] list-none flex-col gap-5 p-0">
          {[
            ["Elige tu dirección", "silaba.io/tu-nombre, para siempre tuya."],
            ["Completa tu perfil", "Foto, portada, especialidades e instituciones."],
            ["Reúne y comparte", "Tus primeros recursos, tus temas y tu primer curso."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 font-bold text-navy-900">{i + 1}</span>
              <span><b>{t}</b><br /><span className="text-mist">{d}</span></span>
            </li>
          ))}
        </ol>
        <p className="m-0 max-w-[440px] rounded-lg border border-gold-500/40 px-4 py-4 text-mist">
          Tus estudiantes no necesitan cuenta: abren el enlace o escanean el código QR de tu curso.
        </p>
      </aside>
    </div>
  );
}

import Link from "next/link";
import PrintButton from "./print-button";
import { requireProfile } from "@/lib/panel";
import type { Course, Note, Resource, Theme } from "@/lib/types";

/** Pro: printable academic portfolio. "Guardar como PDF" from the browser's print dialog. */
export default async function Portafolio() {
  const { supabase, user, profile } = await requireProfile();
  if (profile.plan !== "pro") {
    return (
      <div className="max-w-[640px]">
        <h1 className="font-serif text-[32px] font-medium">Portafolio académico</h1>
        <p className="text-muted">Reúne tu perfil, tus líneas temáticas, tus cursos y tus notas públicas en un documento listo para imprimir o guardar como PDF. Es parte del plan Pro.</p>
        <Link href="/#planes" className="btn btn-navy">Ver planes</Link>
      </div>
    );
  }
  const [themes, courses, notes, resources] = await Promise.all([
    supabase.from("themes").select("*").eq("owner", user.id).order("name"),
    supabase.from("courses").select("*").eq("owner", user.id).order("created_at", { ascending: false }),
    supabase.from("notes").select("*").eq("owner", user.id).eq("is_public", true).order("created_at", { ascending: false }),
    supabase.from("resources").select("id, theme_id, kind").eq("owner", user.id),
  ]);
  const res = (resources.data ?? []) as Pick<Resource, "id" | "theme_id" | "kind">[];

  return (
    <div className="max-w-[820px]">
      <div className="mb-6 flex items-center gap-4 print:hidden">
        <h1 className="m-0 grow font-serif text-[32px] font-medium">Portafolio académico</h1>
        <PrintButton />
      </div>
      <article className="card p-10 print:border-0 print:p-0">
        <header className="border-b-2 border-gold-500 pb-5">
          <h2 className="m-0 font-serif text-4xl font-semibold">{profile.full_name}</h2>
          {profile.headline && <p className="mb-0 mt-1 text-lg">{profile.headline}</p>}
          <p className="mb-0 mt-1 text-sm text-muted">{[profile.location, profile.institutions.join(" · "), `silaba.io/${profile.handle}`].filter(Boolean).join(" · ")}</p>
        </header>
        {profile.bio && <p className="mt-6 whitespace-pre-line">{profile.bio}</p>}
        <h3 className="eyebrow mt-8 text-gold-700">Líneas temáticas</h3>
        {((themes.data ?? []) as Theme[]).map((t) => (
          <p key={t.id} className="my-2"><b className="font-serif text-lg">{t.name}</b> — {res.filter((r) => r.theme_id === t.id).length} recursos{t.description ? `. ${t.description}` : ""}</p>
        ))}
        <h3 className="eyebrow mt-8 text-gold-700">Cursos impartidos</h3>
        {((courses.data ?? []) as Course[]).map((c) => (
          <p key={c.id} className="my-2"><b className="font-serif text-lg">{c.title}</b>{c.term ? ` · ${c.term}` : ""}{c.institutions.length ? ` · ${c.institutions.join(", ")}` : ""}</p>
        ))}
        <h3 className="eyebrow mt-8 text-gold-700">Conferencias y materiales propios</h3>
        <p className="my-2">{res.filter((r) => r.kind === "lecture").length} conferencias · {res.filter((r) => r.kind === "document").length} documentos propios</p>
        {(notes.data ?? []).length > 0 && <h3 className="eyebrow mt-8 text-gold-700">Notas y reflexiones</h3>}
        {((notes.data ?? []) as Note[]).map((n) => (
          <div key={n.id} className="my-4 break-inside-avoid">
            <p className="m-0 font-serif text-lg font-semibold">{n.title}</p>
            <p className="m-0 whitespace-pre-line text-[15px]">{n.body}</p>
          </div>
        ))}
      </article>
    </div>
  );
}

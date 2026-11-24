import Link from "next/link";
import { createCourse, duplicateCourse } from "@/app/panel/actions";
import { requireProfile } from "@/lib/panel";
import type { Course } from "@/lib/types";

export default async function CursosPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { supabase, user, profile } = await requireProfile();
  const { error } = await searchParams;
  const { data } = await supabase.from("courses").select("*").eq("owner", user.id).order("created_at", { ascending: false });
  const courses = (data ?? []) as Course[];
  const atLimit = profile.plan === "free" && courses.length >= 1;

  return (
    <div className="flex max-w-[1000px] flex-col gap-6">
      <div>
        <h1 className="m-0 font-serif text-[32px] font-medium">Cursos</h1>
        <p className="mb-0 mt-1 text-muted">Arma cada curso por semanas con lo que ya tienes en tus líneas temáticas.</p>
      </div>
      {error === "limite" && <p role="alert" className="m-0 rounded bg-warn-bg px-4 py-3 text-warn">El plan Gratis incluye un curso. Pasa a Pro para crear más.</p>}
      {error === "pro" && <p role="alert" className="m-0 rounded bg-warn-bg px-4 py-3 text-warn">Copiar cursos es parte del plan Pro.</p>}

      <section className="card p-6">
        <h2 className="mb-4 mt-0 font-serif text-xl font-medium">Nuevo curso</h2>
        {atLimit ? (
          <p className="m-0 text-muted">Ya usas el curso del plan Gratis. <Link href="/#planes">Pasa a Pro</Link> para cursos ilimitados.</p>
        ) : (
          <form action={createCourse} className="flex flex-wrap items-end gap-3">
            <div className="min-w-0 flex-[2_1_260px]">
              <label htmlFor="ctitle" className="label">Nombre del curso</label>
              <input id="ctitle" name="title" required className="field" placeholder="Administración Estratégica" />
            </div>
            <div className="min-w-0 flex-[1_1_140px]">
              <label htmlFor="cterm" className="label">Ciclo</label>
              <input id="cterm" name="term" className="field" placeholder="II-2026" />
            </div>
            <div className="w-24">
              <label htmlFor="cweeks" className="label">Semanas</label>
              <input id="cweeks" name="weeks" type="number" min={1} max={30} defaultValue={12} className="field" />
            </div>
            <div className="min-w-0 flex-[2_1_260px]">
              <label htmlFor="cinst" className="label">Instituciones (separadas por comas)</label>
              <input id="cinst" name="institutions" className="field" defaultValue={profile.institutions.join(", ")} />
            </div>
            <button className="btn btn-navy">Crear curso</button>
          </form>
        )}
      </section>

      <section className="card p-6">
        <h2 className="mb-2 mt-0 font-serif text-xl font-medium">Mis cursos</h2>
        {courses.length === 0 && <p className="m-0 text-muted">Todavía no tienes cursos.</p>}
        {courses.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center gap-3 border-t border-line py-4">
            <div className="min-w-0 flex-[1_1_280px]">
              <Link href={`/panel/cursos/${c.id}`} className="font-serif text-lg font-semibold text-ink">{c.title}</Link>
              <p className="m-0 text-sm text-muted">{[c.term, c.institutions.join(" · "), c.is_published ? "Publicado" : "Borrador"].filter(Boolean).join(" · ")}</p>
            </div>
            <Link href={`/panel/cursos/${c.id}`} className="btn btn-navy btn-sm">Editar</Link>
            {profile.plan === "pro" && (
              <form action={duplicateCourse} className="flex items-center gap-2">
                <input type="hidden" name="id" value={c.id} />
                <label htmlFor={`term-${c.id}`} className="sr-only">Nuevo ciclo</label>
                <input id={`term-${c.id}`} name="term" placeholder="Nuevo ciclo" className="field min-h-[38px] w-32 text-sm" />
                <button className="btn btn-line btn-sm">Copiar al siguiente ciclo</button>
              </form>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

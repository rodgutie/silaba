import Link from "next/link";
import { notFound } from "next/navigation";
import { addNote, deleteNote, deleteTheme, updateNote, updateTheme } from "@/app/panel/actions";
import { DocumentForm } from "@/components/document-form";
import { QuickCapture } from "@/components/quick-capture";
import { ResourceRow } from "@/components/resource-row";
import { requireProfile } from "@/lib/panel";
import type { Note, Resource, Theme } from "@/lib/types";

export default async function TemaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();
  const [theme, themes, resources, notes] = await Promise.all([
    supabase.from("themes").select("*").eq("id", id).eq("owner", user.id).maybeSingle(),
    supabase.from("themes").select("*").eq("owner", user.id).order("name"),
    supabase.from("resources").select("*").eq("theme_id", id).eq("owner", user.id).order("created_at", { ascending: false }),
    supabase.from("notes").select("*").eq("theme_id", id).eq("owner", user.id).order("created_at", { ascending: false }),
  ]);
  if (!theme.data) notFound();
  const t = theme.data as Theme;

  return (
    <div className="flex max-w-[1000px] flex-col gap-6">
      <Link href="/panel/temas" className="text-sm">← Líneas temáticas</Link>

      <form action={updateTheme} className="card flex flex-col gap-3 border-t-[3px] border-t-gold-500 p-6">
        <input type="hidden" name="id" value={t.id} />
        <label htmlFor="tname" className="sr-only">Nombre</label>
        <input id="tname" name="name" defaultValue={t.name} required className="field font-serif text-2xl" />
        <label htmlFor="tdesc" className="label mb-0">De qué trata esta línea</label>
        <textarea id="tdesc" name="description" rows={2} defaultValue={t.description ?? ""} className="field" />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_public" defaultChecked={t.is_public} /> Mostrar en mi perfil público</label>
          <button className="btn btn-navy btn-sm">Guardar</button>
          <button formAction={deleteTheme} className="ml-auto cursor-pointer border-0 bg-transparent text-sm text-muted underline">Eliminar línea</button>
        </div>
      </form>

      <section className="card p-6">
        <h2 className="mb-4 mt-0 font-serif text-xl font-medium">Reúne: agrega un recurso</h2>
        <QuickCapture themeId={t.id} />
        <div className="mt-5 border-t border-line pt-5">
          <DocumentForm userId={user.id} plan={profile.plan} themeId={t.id} />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="mb-1 mt-0 font-serif text-xl font-medium">Recursos ({(resources.data ?? []).length})</h2>
        {((resources.data ?? []) as Resource[]).map((r) => <ResourceRow key={r.id} r={r} themes={(themes.data ?? []) as Theme[]} />)}
      </section>

      <section className="card p-6">
        <h2 className="mb-1 mt-0 font-serif text-xl font-medium">Desarrolla: tus notas</h2>
        <p className="mb-4 mt-0 text-sm text-muted">Ideas, experiencias de clase y argumentos propios. Privadas salvo que marques “Pública”.</p>
        <form action={addNote} className="flex flex-col gap-3">
          <input type="hidden" name="theme_id" value={t.id} />
          <label htmlFor="ntitle" className="sr-only">Título de la nota</label>
          <input id="ntitle" name="title" required placeholder="Título de la nota" className="field" />
          <label htmlFor="nbody" className="sr-only">Texto</label>
          <textarea id="nbody" name="body" rows={5} placeholder="Escribe tu idea…" className="field" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_public" /> Pública</label>
            <button className="btn btn-navy btn-sm">Guardar nota</button>
          </div>
        </form>
        {((notes.data ?? []) as Note[]).map((n) => (
          <form key={n.id} action={updateNote} className="mt-5 flex flex-col gap-2.5 border-t border-line pt-5">
            <input type="hidden" name="id" value={n.id} />
            <input name="title" aria-label="Título" defaultValue={n.title} className="field font-serif text-lg" />
            <textarea name="body" aria-label="Texto" rows={4} defaultValue={n.body} className="field" />
            <div className="flex items-center gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="is_public" defaultChecked={n.is_public} /> Pública</label>
              <button className="btn btn-line btn-sm">Guardar</button>
              <button formAction={deleteNote} className="cursor-pointer border-0 bg-transparent text-muted underline">Eliminar</button>
            </div>
          </form>
        ))}
      </section>
    </div>
  );
}

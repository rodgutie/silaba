import Link from "next/link";
import { createTheme } from "@/app/panel/actions";
import { QuickCapture } from "@/components/quick-capture";
import { ResourceRow } from "@/components/resource-row";
import { requireProfile } from "@/lib/panel";
import type { Resource, Theme } from "@/lib/types";

export default async function TemasPage() {
  const { supabase, user, profile } = await requireProfile();
  const [themes, resources] = await Promise.all([
    supabase.from("themes").select("*").eq("owner", user.id).order("name"),
    supabase.from("resources").select("*").eq("owner", user.id).order("created_at", { ascending: false }),
  ]);
  const t = (themes.data ?? []) as Theme[];
  const all = (resources.data ?? []) as Resource[];
  const count = (id: string) => all.filter((r) => r.theme_id === id).length;
  const unsorted = all.filter((r) => !r.theme_id);

  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <h1 className="m-0 font-serif text-[32px] font-medium">Recursos y líneas temáticas</h1>
        <p className="mb-0 mt-1 text-muted">Tu hilo conductor: agrupa lo que lees y lo que piensas por tema. Todo es privado hasta que lo publiques.</p>
      </div>

      <section className="card p-6">
        <QuickCapture themes={t} />
      </section>

      <section>
        <h2 className="mb-3.5 mt-0 font-serif text-2xl font-medium">Líneas temáticas</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(260px,100%),1fr))] gap-5">
          {t.map((theme) => (
            <Link key={theme.id} href={`/panel/temas/${theme.id}`} className="lift card flex flex-col gap-1.5 border-t-[3px] border-t-gold-500 p-5 text-ink no-underline">
              <b className="font-serif text-xl">{theme.name}</b>
              {theme.description && <span className="line-clamp-2 text-sm text-muted">{theme.description}</span>}
              <span className="mt-1 text-[13px] text-muted">{count(theme.id)} recursos{theme.is_public ? " · Pública" : ""}</span>
            </Link>
          ))}
          <form action={createTheme} className="flex flex-col gap-2.5 rounded-[10px] border-2 border-dashed border-[#C9C2B0] p-5">
            <label htmlFor="new-theme" className="label mb-0">Nueva línea temática</label>
            <input id="new-theme" name="name" required placeholder="Ej.: Ética empresarial" className="field" />
            <button className="btn btn-line btn-sm self-start">Crear</button>
          </form>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="mb-1 mt-0 font-serif text-xl font-medium">Sin clasificar ({unsorted.length})</h2>
        <p className="mb-2 mt-0 text-sm text-muted">Asígnales una línea temática cuando tengas tiempo.</p>
        {unsorted.map((r) => <ResourceRow key={r.id} r={r} themes={t} />)}
      </section>
      {profile.plan === "free" && <p className="text-sm text-muted">Plan Gratis: líneas temáticas, enlaces, DOI y videos ilimitados. Los documentos propios son parte de Pro.</p>}
    </div>
  );
}

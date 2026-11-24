import Link from "next/link";
import { QrCode } from "@/components/brand";
import { QuickCapture } from "@/components/quick-capture";
import { ResourceRow } from "@/components/resource-row";
import ShareButton from "@/components/share-button";
import { requireProfile } from "@/lib/panel";
import type { Course, Resource, Theme } from "@/lib/types";
import { SITE_URL } from "@/lib/utils";

export default async function PanelHome({ searchParams }: { searchParams: Promise<{ bienvenida?: string }> }) {
  const { supabase, user, profile } = await requireProfile();
  const { bienvenida } = await searchParams;
  const [themes, inbox, courses, counts] = await Promise.all([
    supabase.from("themes").select("*").eq("owner", user.id).order("name"),
    supabase.from("resources").select("*").eq("owner", user.id).is("theme_id", null).order("created_at", { ascending: false }).limit(8),
    supabase.from("courses").select("*").eq("owner", user.id).order("created_at", { ascending: false }),
    supabase.from("resources").select("id", { count: "exact", head: true }).eq("owner", user.id),
  ]);
  const t = (themes.data ?? []) as Theme[];
  const c = (courses.data ?? []) as Course[];
  const url = `${SITE_URL}/${profile.handle}`;
  const firstName = (profile.full_name ?? "").split(" ")[0];

  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <div>
        <h1 className="m-0 font-serif text-[32px] font-medium">{bienvenida ? "¡Bienvenido" : "Hola"}{firstName ? `, ${firstName}` : ""}{bienvenida ? "!" : ""}</h1>
        <p className="mb-0 mt-1 text-muted">
          {counts.count ?? 0} recursos · {t.length} líneas temáticas · {c.length} cursos
        </p>
      </div>

      <section className="card p-6">
        <h2 className="mb-1 mt-0 font-serif text-xl font-medium">Reúne</h2>
        <p className="mb-4 mt-0 text-sm text-muted">Guarda lo que encuentres. Si es un DOI, la ficha se completa sola.</p>
        <QuickCapture themes={t} />
      </section>

      <div className="flex flex-wrap gap-6">
        <section className="card min-w-0 flex-[2_1_420px] p-6">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 className="m-0 font-serif text-xl font-medium">Por clasificar</h2>
            <Link href="/panel/temas" className="text-sm font-semibold">Ver líneas temáticas →</Link>
          </div>
          {(inbox.data ?? []).length === 0 && <p className="m-0 text-sm text-muted">Todo está ordenado. Lo nuevo que guardes sin tema aparecerá aquí.</p>}
          {((inbox.data ?? []) as Resource[]).map((r) => <ResourceRow key={r.id} r={r} themes={t} />)}
        </section>

        <section className="dg flex min-w-0 flex-[1_1_280px] flex-col gap-3 rounded-[10px] bg-navy-900 p-6 text-white">
          <h2 className="m-0 font-serif text-xl font-medium">Tu enlace público</h2>
          <p className="m-0 break-all font-semibold text-gold-500">{url.replace(/^https?:\/\//, "")}</p>
          <div className="flex items-center gap-4">
            <QrCode url={url} size={112} label="Código QR de tu perfil" />
            <div className="flex flex-col gap-2">
              <ShareButton url={url} label="Copiar enlace" className="btn btn-gold btn-sm" />
              <a href={`/api/qr?p=/${profile.handle}`} className="nl text-sm">Descargar QR ↓</a>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div className="mb-3.5 flex items-baseline justify-between">
          <h2 className="m-0 font-serif text-2xl font-medium">Mis cursos</h2>
          <Link href="/panel/cursos" className="text-sm font-semibold">Crear o administrar →</Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(280px,100%),1fr))] gap-5">
          {c.map((course) => (
            <Link key={course.id} href={`/panel/cursos/${course.id}`} className="lift card flex flex-col gap-2 p-5 text-ink no-underline">
              <span className="flex justify-between gap-2">
                <b className="font-serif text-lg">{course.title}</b>
                <span className={`h-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${course.is_published ? "bg-[#E3F2EA] text-success" : "bg-ivory text-muted"}`}>
                  {course.is_published ? "Publicado" : "Borrador"}
                </span>
              </span>
              <span className="text-sm text-muted">{[course.term, course.institutions.join(" · ")].filter(Boolean).join(" · ") || "Sin institución"}</span>
            </Link>
          ))}
          <Link href="/panel/cursos" className="flex min-h-[110px] flex-col items-center justify-center gap-1 rounded-[10px] border-2 border-dashed border-[#C9C2B0] p-5 text-muted no-underline">
            <span className="text-3xl leading-none text-navy-900">+</span>
            <span className="font-semibold text-ink">Crear un curso</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

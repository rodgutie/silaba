import Link from "next/link";
import { notFound } from "next/navigation";
import { addItemFromLibrary, addWeek, deleteCourse, removeItem, updateCourse, updateWeek } from "@/app/panel/actions";
import { QrCode } from "@/components/brand";
import { DocumentForm } from "@/components/document-form";
import { QuickCapture } from "@/components/quick-capture";
import { AccessTag } from "@/components/resource-view";
import ShareButton from "@/components/share-button";
import { getCourseWithWeeks } from "@/lib/data";
import { requireProfile } from "@/lib/panel";
import { KIND_LABEL, ROLE_LABEL, type Resource, type Theme } from "@/lib/types";
import { SITE_URL } from "@/lib/utils";

export default async function CourseEditor({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ semana?: string }> }) {
  const { id } = await params;
  const { semana } = await searchParams;
  const { supabase, user, profile } = await requireProfile();
  const data = await getCourseWithWeeks({ id, owner: user.id });
  if (!data) notFound();
  const { course, weeks } = data;
  const [lib, th] = await Promise.all([
    supabase.from("resources").select("*").eq("owner", user.id).order("created_at", { ascending: false }),
    supabase.from("themes").select("*").eq("owner", user.id).order("name"),
  ]);
  const library = (lib.data ?? []) as Resource[];
  const themes = (th.data ?? []) as Theme[];
  const url = `${SITE_URL}/${profile.handle}/${course.slug}`;
  const openWeek = semana ? Number(semana) : (weeks.find((w) => w.items.length === 0)?.number ?? 1);

  return (
    <div className="flex max-w-[1100px] flex-col gap-6">
      <Link href="/panel/cursos" className="text-sm">← Cursos</Link>

      <div className="flex flex-wrap items-start gap-6">
        <form action={updateCourse} className="card flex min-w-0 flex-[2_1_480px] flex-col gap-4 p-6">
          <input type="hidden" name="id" value={course.id} />
          <div>
            <label htmlFor="title" className="label">Nombre del curso</label>
            <input id="title" name="title" defaultValue={course.title} required className="field font-serif text-xl" />
          </div>
          <div>
            <label htmlFor="description" className="label">Descripción breve</label>
            <textarea id="description" name="description" rows={2} defaultValue={course.description ?? ""} className="field" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="min-w-0 flex-[1_1_140px]">
              <label htmlFor="term" className="label">Ciclo</label>
              <input id="term" name="term" defaultValue={course.term ?? ""} className="field" />
            </div>
            <div className="min-w-0 flex-[2_1_260px]">
              <label htmlFor="institutions" className="label">Se imparte en (comas)</label>
              <input id="institutions" name="institutions" defaultValue={course.institutions.join(", ")} className="field" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="is_published" defaultChecked={course.is_published} /> Publicado (visible para estudiantes)</label>
            <button className="btn btn-navy btn-sm">Guardar</button>
            <button formAction={deleteCourse} className="ml-auto cursor-pointer border-0 bg-transparent text-sm text-muted underline">Eliminar curso</button>
          </div>
        </form>

        <section className="dg flex min-w-0 flex-[1_1_280px] flex-col gap-3 rounded-[10px] bg-navy-900 p-6 text-white">
          <h2 className="m-0 font-serif text-xl font-medium">Compartir con estudiantes</h2>
          {course.is_published ? (
            <>
              <div className="flex items-center gap-4">
                <QrCode url={url} size={120} label="Código QR del curso" />
                <div className="flex flex-col gap-2">
                  <ShareButton url={url} label="Copiar enlace" className="btn btn-gold btn-sm" />
                  <a href={`/api/qr?p=/${profile.handle}/${course.slug}`} className="nl text-sm">Descargar QR ↓</a>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="nl text-sm">Vista del estudiante ↗</a>
                </div>
              </div>
              <p className="m-0 break-all text-xs text-mist">{url}</p>
            </>
          ) : (
            <p className="m-0 text-mist">Marca el curso como publicado para obtener el enlace y el código QR.</p>
          )}
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="m-0 font-serif text-2xl font-medium">Semanas</h2>
        {weeks.map((w) => (
          <details key={w.id} open={w.number === openWeek} className="card group">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-6 py-4">
              <span><b>Semana {w.number}</b>{w.title ? ` · ${w.title}` : ""}</span>
              <span className="text-sm text-muted">{w.items.length} materiales ▾</span>
            </summary>
            <div className="flex flex-col gap-5 border-t border-line px-6 py-5">
              <form action={updateWeek} className="flex flex-wrap items-end gap-3">
                <input type="hidden" name="id" value={w.id} />
                <div className="min-w-0 flex-[2_1_240px]">
                  <label htmlFor={`wt-${w.id}`} className="label">Tema de la semana</label>
                  <input id={`wt-${w.id}`} name="title" defaultValue={w.title ?? ""} className="field" />
                </div>
                <div className="min-w-0 flex-[1_1_160px]">
                  <label htmlFor={`wd-${w.id}`} className="label">Fechas</label>
                  <input id={`wd-${w.id}`} name="dates" defaultValue={w.dates ?? ""} placeholder="15–21 sep" className="field" />
                </div>
                <div className="w-full">
                  <label htmlFor={`wn-${w.id}`} className="label">Nota para estudiantes</label>
                  <textarea id={`wn-${w.id}`} name="note" rows={2} defaultValue={w.note ?? ""} className="field" />
                </div>
                <button className="btn btn-line btn-sm">Guardar semana</button>
              </form>

              <div>
                {w.items.map((it) => (
                  <div key={it.id} className="flex flex-wrap items-center gap-3 border-t border-line py-3">
                    <span className="tag bg-[#E7ECF4] text-navy-900">{KIND_LABEL[it.resource.kind]}</span>
                    <span className="min-w-0 flex-[1_1_240px]">
                      <b className="font-serif">{it.resource.title}</b>
                      <span className="block text-[13px] text-muted">{ROLE_LABEL[it.role]}</span>
                    </span>
                    <AccessTag access={it.resource.access} />
                    <form action={removeItem}>
                      <input type="hidden" name="id" value={it.id} />
                      <button className="cursor-pointer border-0 bg-transparent text-sm text-muted underline">Quitar</button>
                    </form>
                  </div>
                ))}
              </div>

              {library.length > 0 && (
                <form action={addItemFromLibrary} className="flex flex-wrap items-end gap-3 rounded-lg bg-ivory p-4">
                  <input type="hidden" name="week_id" value={w.id} />
                  <div className="min-w-0 flex-[3_1_280px]">
                    <label htmlFor={`lib-${w.id}`} className="label">Desde tus líneas temáticas</label>
                    <select id={`lib-${w.id}`} name="resource_id" className="field">
                      {[...themes, { id: "", name: "Sin clasificar" } as Theme].map((t) => {
                        const items = library.filter((r) => (r.theme_id ?? "") === t.id);
                        return items.length ? (
                          <optgroup key={t.id || "none"} label={t.name}>
                            {items.map((r) => <option key={r.id} value={r.id}>{r.title.slice(0, 90)}</option>)}
                          </optgroup>
                        ) : null;
                      })}
                    </select>
                  </div>
                  <div className="min-w-0 flex-[1_1_170px]">
                    <label htmlFor={`role-${w.id}`} className="label">Como</label>
                    <select id={`role-${w.id}`} name="role" className="field">
                      <option value="required">Lectura obligatoria</option>
                      <option value="complementary">Complementaria</option>
                      <option value="support">Recurso de apoyo</option>
                    </select>
                  </div>
                  <button className="btn btn-navy">Agregar</button>
                </form>
              )}

              <div className="rounded-lg border border-line p-4">
                <p className="eyebrow m-0 mb-3 text-[11px] text-gold-700">O agrega algo nuevo</p>
                <QuickCapture weekId={w.id} compact />
              </div>
              <div className="rounded-lg border border-line p-4">
                <DocumentForm userId={user.id} plan={profile.plan} weekId={w.id} />
              </div>
            </div>
          </details>
        ))}
        <form action={addWeek}>
          <input type="hidden" name="course_id" value={course.id} />
          <button className="btn btn-line btn-sm">+ Agregar semana</button>
        </form>
      </section>
    </div>
  );
}

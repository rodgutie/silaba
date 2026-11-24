import { deleteResource, updateResource } from "@/app/panel/actions";
import { AccessTag, resourceHref, resourceMeta } from "@/components/resource-view";
import { KIND_LABEL, type Resource, type Theme } from "@/lib/types";

/** A resource in the professor's library, with quick edits. */
export function ResourceRow({ r, themes }: { r: Resource; themes: Theme[] }) {
  const href = resourceHref(r);
  return (
    <div className="border-t border-line py-4">
      <div className="flex flex-wrap items-start gap-3">
        <span className="tag bg-[#E7ECF4] text-navy-900">{KIND_LABEL[r.kind]}</span>
        <div className="min-w-0 flex-[1_1_260px]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="font-serif text-[17px] font-semibold text-ink no-underline hover:underline">{r.title}</a>
          ) : (
            <span className="font-serif text-[17px] font-semibold">{r.title}</span>
          )}
          {resourceMeta(r) && <p className="m-0 text-[13px] text-muted">{resourceMeta(r)}</p>}
        </div>
        <AccessTag access={r.access} />
      </div>
      <form action={updateResource} className="mt-2.5 flex flex-wrap items-center gap-2.5 text-sm">
        <input type="hidden" name="id" value={r.id} />
        <select name="theme_id" defaultValue={r.theme_id ?? ""} aria-label="Línea temática" className="field min-h-9 w-auto max-w-[220px] py-0 text-sm">
          <option value="">Sin clasificar</option>
          {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <input name="note" defaultValue={r.note ?? ""} placeholder="Nota" aria-label="Nota" className="field min-h-9 min-w-[160px] flex-1 text-sm" />
        <label className="flex items-center gap-1.5"><input type="checkbox" name="is_public" defaultChecked={r.is_public} /> Público</label>
        <button className="btn btn-line btn-sm">Guardar</button>
        <button formAction={deleteResource} className="cursor-pointer border-0 bg-transparent text-sm text-muted underline">Eliminar</button>
      </form>
    </div>
  );
}

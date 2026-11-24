import { addResource } from "@/app/panel/actions";
import type { Theme } from "@/lib/types";

/** Paste a link, DOI or video: the card fills itself in. */
export function QuickCapture({ themes, themeId, weekId, compact = false }: { themes?: Theme[]; themeId?: string; weekId?: string; compact?: boolean }) {
  return (
    <form action={addResource} className="flex flex-wrap items-end gap-3">
      {themeId && <input type="hidden" name="theme_id" value={themeId} />}
      {weekId && <input type="hidden" name="week_id" value={weekId} />}
      <div className="min-w-0 flex-[3_1_280px]">
        <label className="label" htmlFor={`in-${weekId ?? themeId ?? "q"}`}>Pega un enlace, un DOI o un video</label>
        <input id={`in-${weekId ?? themeId ?? "q"}`} name="input" required placeholder="https://… o 10.1234/…" className="field" />
      </div>
      <div className="min-w-0 flex-[1_1_160px]">
        <label className="label" htmlFor={`k-${weekId ?? themeId ?? "q"}`}>Tipo</label>
        <select id={`k-${weekId ?? themeId ?? "q"}`} name="kind" className="field">
          <option value="">Detectar automáticamente</option>
          <option value="lecture">Conferencia o charla</option>
        </select>
      </div>
      {!themeId && themes && themes.length > 0 && (
        <div className="min-w-0 flex-[1_1_180px]">
          <label className="label" htmlFor="q-theme">Línea temática</label>
          <select id="q-theme" name="theme_id" className="field">
            <option value="">Sin clasificar</option>
            {themes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}
      {weekId && (
        <div className="min-w-0 flex-[1_1_180px]">
          <label className="label" htmlFor={`r-${weekId}`}>En el curso</label>
          <select id={`r-${weekId}`} name="role" className="field">
            <option value="required">Lectura obligatoria</option>
            <option value="complementary">Complementaria</option>
            <option value="support">Recurso de apoyo</option>
          </select>
        </div>
      )}
      {!compact && (
        <div className="min-w-0 flex-[2_1_240px]">
          <label className="label" htmlFor={`n-${weekId ?? themeId ?? "q"}`}>Nota (opcional)</label>
          <input id={`n-${weekId ?? themeId ?? "q"}`} name="note" placeholder="¿Por qué lo guardas?" className="field" />
        </div>
      )}
      <button className="btn btn-navy">Guardar</button>
    </form>
  );
}

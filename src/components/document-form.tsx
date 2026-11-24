import Link from "next/link";
import { addDocument } from "@/app/panel/actions";
import Uploader from "@/components/uploader";
import type { Plan } from "@/lib/types";

/** Upload your own material (Pro). Other authors' works are added as links. */
export function DocumentForm({ userId, plan, themeId, weekId }: { userId: string; plan: Plan; themeId?: string; weekId?: string }) {
  if (plan !== "pro") {
    return (
      <p className="m-0 rounded bg-ivory px-4 py-3 text-sm text-muted">
        Subir documentos propios (PDF, Word, PowerPoint) es parte del plan Pro. <Link href="/#planes">Ver planes</Link>
      </p>
    );
  }
  const k = weekId ?? themeId ?? "d";
  return (
    <form action={addDocument} className="flex flex-col gap-3">
      {themeId && <input type="hidden" name="theme_id" value={themeId} />}
      {weekId && <input type="hidden" name="week_id" value={weekId} />}
      <Uploader bucket="documents" userId={userId} name="file_path" accept=".pdf,.doc,.docx,.ppt,.pptx" maxMb={50} label="Tu documento (máx. 50 MB)" />
      <div className="flex flex-wrap gap-3">
        <div className="min-w-0 flex-[2_1_240px]">
          <label htmlFor={`dt-${k}`} className="label">Título</label>
          <input id={`dt-${k}`} name="title" required className="field" placeholder="Guía de lectura — Semana 3" />
        </div>
        <div className="min-w-0 flex-[1_1_200px]">
          <label htmlFor={`dl-${k}`} className="label">Licencia</label>
          <select id={`dl-${k}`} name="license" className="field">
            <option value="CC BY-NC">CC BY-NC (uso no comercial)</option>
            <option value="CC BY">CC BY</option>
            <option value="Todos los derechos reservados">Todos los derechos reservados · libre lectura</option>
          </select>
        </div>
      </div>
      <label className="flex items-start gap-2.5 text-sm">
        <input type="checkbox" name="declaration" required className="mt-1" />
        Soy autor de este material o tengo derecho a compartirlo. Los artículos y libros de otros autores los agrego como enlace.
      </label>
      <button className="btn btn-navy self-start">Agregar documento</button>
    </form>
  );
}

import { saveProfile } from "@/app/panel/actions";
import Uploader from "@/components/uploader";
import { requireProfile } from "@/lib/panel";

const ERRORS: Record<string, string> = {
  handle: "La dirección debe tener entre 3 y 40 caracteres: letras minúsculas, números o guiones.",
  taken: "Esa dirección ya está en uso. Prueba con otra.",
  save: "No pudimos guardar. Intenta de nuevo.",
};

export default async function PerfilPage({ searchParams }: { searchParams: Promise<{ handle?: string; error?: string; ok?: string }> }) {
  const { user, profile } = await requireProfile({ allowIncomplete: true });
  const sp = await searchParams;
  const isNew = !profile.handle;

  return (
    <div className="max-w-[760px]">
      <h1 className="m-0 font-serif text-[32px] font-medium">{isNew ? "Crea tu perfil" : "Mi perfil"}</h1>
      <p className="mb-6 mt-1 text-muted">{isNew ? "Elige tu dirección y cuéntale al mundo qué enseñas." : "Lo que aquí escribas se ve en tu perfil público."}</p>
      {sp.error && <p role="alert" className="rounded bg-warn-bg px-4 py-3 text-warn">{ERRORS[sp.error] ?? ERRORS.save}</p>}
      {sp.ok && <p role="status" className="rounded bg-[#E3F2EA] px-4 py-3 text-success">Perfil guardado.</p>}

      <form action={saveProfile} className="card flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <label htmlFor="handle" className="label">Tu dirección</label>
          <div className="field flex items-center gap-0 px-3">
            <span className="text-muted">silaba.io/</span>
            <input id="handle" name="handle" required pattern="[a-z0-9][a-z0-9-]{2,39}" defaultValue={profile.handle ?? sp.handle ?? ""} placeholder="tu-nombre" className="min-w-0 grow border-0 bg-transparent py-3 outline-none" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="label">Nombre completo</label>
            <input id="full_name" name="full_name" required defaultValue={profile.full_name ?? ""} className="field" />
          </div>
          <div>
            <label htmlFor="location" className="label">Ciudad y país</label>
            <input id="location" name="location" defaultValue={profile.location ?? ""} placeholder="San José, Costa Rica" className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="headline" className="label">Una línea sobre ti</label>
          <input id="headline" name="headline" defaultValue={profile.headline ?? ""} placeholder="Docente de Administración de Empresas" className="field" />
        </div>
        <div>
          <label htmlFor="bio" className="label">Sobre mí</label>
          <textarea id="bio" name="bio" rows={4} defaultValue={profile.bio ?? ""} className="field" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="specialties" className="label">Especialidades (separadas por comas)</label>
            <input id="specialties" name="specialties" defaultValue={profile.specialties.join(", ")} placeholder="Estrategia, Innovación" className="field" />
          </div>
          <div>
            <label htmlFor="institutions" className="label">Instituciones donde enseñas (comas)</label>
            <input id="institutions" name="institutions" defaultValue={profile.institutions.join(", ")} className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="links" className="label">Enlaces (uno por línea: Nombre | https://…)</label>
          <textarea id="links" name="links" rows={3} defaultValue={profile.links.map((l) => `${l.label} | ${l.url}`).join("\n")} placeholder={"ORCID | https://orcid.org/…\nLinkedIn | https://linkedin.com/in/…"} className="field" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Uploader bucket="media" userId={user.id} name="avatar_url" accept="image/jpeg,image/png,image/webp" maxMb={5} label="Foto de perfil (400 × 400)" returnPublicUrl prefix="avatar-" />
          <Uploader bucket="media" userId={user.id} name="cover_url" accept="image/jpeg,image/png,image/webp" maxMb={5} label="Portada (1500 × 400)" returnPublicUrl prefix="cover-" />
        </div>
        <button className="btn btn-navy self-start">{isNew ? "Crear mi perfil" : "Guardar cambios"}</button>
      </form>
    </div>
  );
}

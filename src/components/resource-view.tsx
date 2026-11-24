import { publicFileUrl } from "@/lib/data";
import { ACCESS_LABEL, KIND_LABEL, ROLE_LABEL, type ItemRole, type Resource } from "@/lib/types";
import { videoEmbedUrl } from "@/lib/utils";

export function AccessTag({ access }: { access: Resource["access"] }) {
  if (access === "unknown") return null;
  const cls =
    access === "open" ? "bg-[#E3F2EA] text-success" : access === "own" ? "bg-[#E7ECF4] text-navy-900" : "bg-warn-bg text-warn";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${cls}`}>{ACCESS_LABEL[access]}</span>;
}

export function resourceHref(r: Resource) {
  if (r.kind === "document" && r.file_path) return publicFileUrl("documents", r.file_path);
  return r.url ?? (r.doi ? `https://doi.org/${r.doi}` : null);
}

export function resourceMeta(r: Resource) {
  return [r.authors, r.year, r.source].filter(Boolean).join(" · ");
}

/** How a resource looks to students and visitors. */
export function ResourceCard({ r, role, index }: { r: Resource; role?: ItemRole; index?: number }) {
  const href = resourceHref(r);
  const embed = r.kind === "video" ? videoEmbedUrl(r.url) : null;
  const label = [role ? ROLE_LABEL[role] : null, KIND_LABEL[r.kind]].filter(Boolean).join(" · ");

  return (
    <article className="overflow-hidden rounded-lg border border-line bg-white">
      {embed && (
        <div className="relative aspect-video bg-navy-900">
          <iframe
            src={embed}
            title={r.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <p className="eyebrow m-0 mb-1.5 text-[11px] text-navy-900">
          {index ? `${index}. ` : ""}
          {label}
        </p>
        <p className="m-0 font-serif text-[17px] font-semibold leading-snug">{r.title}</p>
        {resourceMeta(r) && <p className="mb-0 mt-1 text-[13px] text-muted">{resourceMeta(r)}</p>}
        {r.note && <p className="mb-0 mt-2 text-sm text-[#2D3748]">{r.note}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <AccessTag access={r.access} />
          {r.license && <span className="text-xs text-muted">Licencia {r.license}</span>}
          {href && !embed && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-navy btn-sm ml-auto">
              {r.kind === "document" ? "Descargar" : "Abrir original"}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

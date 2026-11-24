import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader, QrCode } from "@/components/brand";
import ShareButton from "@/components/share-button";
import { getProfileByHandle, getPublicProfileContent } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const p = await getProfileByHandle(handle);
  if (!p) return {};
  return { title: p.full_name ?? p.handle ?? "Perfil", description: p.headline ?? undefined };
}

function initials(name: string | null) {
  return (name ?? "?").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}

export default async function ProfilePage({ params }: Props) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile?.handle) notFound();
  const { courses, themes, notes } = await getPublicProfileContent(profile.id);
  const url = `${SITE_URL}/${profile.handle}`;
  const meta = [profile.location, profile.institutions.length ? `${profile.institutions.length} ${profile.institutions.length === 1 ? "institución" : "instituciones"}` : null].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-ivory">
      <PublicHeader />
      <main className="mx-auto max-w-[1120px] px-4 py-7 sm:px-6">
        <section className="card overflow-hidden">
          <div
            className="dg relative h-[180px] overflow-hidden bg-navy-700 bg-cover bg-center sm:h-[240px]"
            style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})` } : undefined}
          >
            {!profile.cover_url && (
              <>
                <div aria-hidden className="absolute -top-[110px] right-[8%] h-[340px] w-[340px] rounded-full border-[1.5px] border-gold-500" />
                {profile.specialties.length > 0 && (
                  <p aria-hidden className="absolute bottom-5 left-9 m-0 font-serif text-xl italic text-[#E8ECF3]">{profile.specialties.slice(0, 3).join(" · ")}</p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-wrap items-end gap-7 px-6 pb-7 sm:px-9">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" className="relative -mt-20 h-40 w-40 shrink-0 rounded-full border-[6px] border-white object-cover outline outline-1 outline-gold-500" />
            ) : (
              <div className="relative -mt-20 flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[6px] border-white bg-navy-900 font-serif text-5xl font-semibold text-white outline outline-1 outline-gold-500">
                {initials(profile.full_name)}
              </div>
            )}
            <div className="min-w-0 flex-[1_1_320px] pt-4">
              <h1 className="m-0 font-serif text-[34px] font-semibold leading-tight tracking-[-0.01em] sm:text-[38px]">{profile.full_name ?? profile.handle}</h1>
              {profile.headline && <p className="mb-2 mt-1.5 text-lg text-[#2D3748]">{profile.headline}</p>}
              {meta && <p className="eyebrow m-0 text-[13px] text-gold-700">{meta}</p>}
            </div>
            <div className="flex flex-wrap gap-2.5 pb-1">
              <ShareButton url={url} label="Compartir perfil" />
            </div>
          </div>
        </section>

        <div className="mt-7 flex flex-wrap items-start gap-7">
          <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-7">
            <section className="card p-6 sm:p-8">
              <h2 className="mb-4 mt-0 font-serif text-[28px] font-medium">Cursos</h2>
              {courses.length === 0 && <p className="m-0 text-muted">Todavía no hay cursos publicados.</p>}
              {courses.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/${profile.handle}/${c.slug}`}
                  className={`-mx-3 flex flex-wrap gap-5 px-3 py-5 text-ink no-underline transition-colors hover:bg-ivory ${i === 0 ? "border-t border-gold-500" : "border-t border-line"} ${i === courses.length - 1 ? "border-b border-line" : ""}`}
                >
                  <span className="w-10 shrink-0 font-serif text-3xl italic leading-none text-gold-500">{toRoman(i + 1)}</span>
                  <span className="min-w-0 flex-[1_1_280px]">
                    <span className="block font-serif text-[22px] font-semibold leading-snug">{c.title}</span>
                    {c.description && <span className="mb-2 mt-1 block text-[15px] text-muted">{c.description}</span>}
                    <span className="flex flex-wrap gap-2 text-xs">
                      {c.term && <span className="rounded-full bg-ivory px-2.5 py-0.5 text-muted">{c.term}</span>}
                      {c.institutions.map((inst) => (
                        <span key={inst} className="rounded-full border border-[#C3CCDB] px-2.5 py-0.5 text-navy-900">{inst}</span>
                      ))}
                    </span>
                  </span>
                  <span className="self-center text-sm font-semibold text-navy-900">Ver curso →</span>
                </Link>
              ))}
            </section>

            {themes.length > 0 && (
              <section className="card p-6 sm:p-8">
                <h2 className="mb-4 mt-0 font-serif text-[28px] font-medium">Líneas temáticas</h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-4">
                  {themes.map((t) => (
                    <div key={t.id} className="border-t border-gold-500 pt-3">
                      <p className="m-0 font-serif text-xl font-semibold">{t.name}</p>
                      {t.description && <p className="mb-0 mt-1 text-sm text-muted">{t.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {notes.length > 0 && (
              <section className="card p-6 sm:p-8">
                <h2 className="mb-2 mt-0 font-serif text-[28px] font-medium">Notas y reflexiones</h2>
                {notes.map((n) => (
                  <article key={n.id} className="border-t border-line py-4">
                    <p className="m-0 font-serif text-xl">{n.title}</p>
                    <p className="mb-0 mt-1 line-clamp-3 whitespace-pre-line text-[15px] text-[#2D3748]">{n.body}</p>
                  </article>
                ))}
              </section>
            )}
          </div>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-7">
            <section className="card flex flex-wrap items-center gap-5 p-6">
              <QrCode url={url} size={128} label={`Código QR de ${url}`} />
              <div className="min-w-0 flex-[1_1_140px]">
                <h2 className="mb-1.5 mt-0 font-serif text-[22px] font-medium">Comparte con un QR</h2>
                <p className="mb-3 mt-0 text-sm text-muted">Proyéctalo en clase o imprímelo en el programa del curso.</p>
                <a href={`/api/qr?p=/${profile.handle}`} className="btn btn-navy btn-sm">Descargar PNG</a>
              </div>
            </section>
            {profile.bio && (
              <section className="card p-7">
                <h2 className="mb-2.5 mt-0 font-serif text-[22px] font-medium">Sobre mí</h2>
                <p className="m-0 whitespace-pre-line text-[15px] text-[#2D3748]">{profile.bio}</p>
              </section>
            )}
            {profile.specialties.length > 0 && (
              <section className="card p-7">
                <h2 className="mb-3 mt-0 font-serif text-[22px] font-medium">Especialidades</h2>
                <div className="flex flex-wrap gap-2 text-sm">
                  {profile.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-navy-900 px-3 py-1 text-white">{s}</span>
                  ))}
                </div>
              </section>
            )}
            {profile.links.length > 0 && (
              <section className="dg rounded-[10px] bg-navy-900 p-7 text-white">
                <h2 className="mb-3 mt-0 font-serif text-[22px] font-medium">Enlaces</h2>
                <ul className="m-0 list-none p-0">
                  {profile.links.map((l) => (
                    <li key={l.url} className="border-t border-gold-500/40 py-2.5 last:border-b">
                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-white no-underline">
                        {l.label} <span className="text-gold-500">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
        <p className="mb-2 mt-9 text-center text-[13px] text-muted">
          Perfil creado con <Link href="/" className="font-serif font-semibold">sílaba</Link> ·{" "}
          <a href={`mailto:hola@silaba.io?subject=Reporte%20de%20contenido%20en%20${encodeURIComponent(url)}`} className="text-muted">Reportar contenido</a>
        </p>
      </main>
    </div>
  );
}

function toRoman(n: number) {
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo, QrCode } from "@/components/brand";
import { ResourceCard } from "@/components/resource-view";
import { getCourseWithWeeks, getProfileByHandle } from "@/lib/data";
import { SITE_URL } from "@/lib/utils";

type Props = { params: Promise<{ handle: string; curso: string }>; searchParams: Promise<{ semana?: string }> };

async function load(handle: string, slug: string) {
  const profile = await getProfileByHandle(handle);
  if (!profile) return null;
  const data = await getCourseWithWeeks({ owner: profile.id, slug });
  if (!data || !data.course.is_published) return null;
  return { profile, ...data };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle, curso } = await params;
  const d = await load(handle, curso);
  return d ? { title: `${d.course.title} — ${d.profile.full_name ?? d.profile.handle}` } : {};
}

export default async function CoursePage({ params, searchParams }: Props) {
  const { handle, curso } = await params;
  const { semana } = await searchParams;
  const d = await load(handle, curso);
  if (!d) notFound();
  const { profile, course, weeks } = d;
  const current = weeks.find((w) => String(w.number) === semana) ?? weeks.findLast((w) => w.items.length > 0) ?? weeks[0];
  const url = `${SITE_URL}/${profile.handle}/${course.slug}`;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-[760px] px-5 pt-4">
          <div className="flex items-center justify-between gap-3">
            <Link href={`/${profile.handle}`} className="flex items-center gap-2.5 text-ink no-underline">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 font-serif text-[13px] font-semibold text-white">
                {(profile.full_name ?? "?").split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
              </span>
              <span className="text-sm font-semibold">{profile.full_name ?? profile.handle}</span>
            </Link>
            <Logo size={18} />
          </div>
          <h1 className="mb-0.5 mt-3.5 font-serif text-[28px] font-semibold leading-tight">{course.title}</h1>
          <p className="mb-3.5 mt-0 text-[13px] text-muted">{[course.institutions.join(" · "), course.term].filter(Boolean).join(" · ")}</p>
          {weeks.length > 0 && (
            <nav aria-label="Semanas" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-3.5">
              {weeks.map((w) => {
                const active = w.id === current?.id;
                return (
                  <Link
                    key={w.id}
                    href={`?semana=${w.number}`}
                    scroll={false}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold no-underline ${active ? "bg-navy-900 text-white" : "border border-[#B9C2D0] bg-white text-ink"}`}
                  >
                    Sem {w.number}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-[760px] flex-col gap-3.5 px-5 py-5">
        {!current && <p className="text-muted">Este curso todavía no tiene semanas publicadas.</p>}
        {current && (
          <>
            <div>
              <p className="eyebrow m-0 text-[13px] text-gold-700">Semana {current.number}{current.dates ? ` · ${current.dates}` : ""}</p>
              {current.title && <h2 className="m-0 mt-0.5 font-serif text-2xl font-semibold">{current.title}</h2>}
            </div>
            {current.note && (
              <div className="rounded-r-lg border-l-2 border-gold-500 bg-white px-4 py-3">
                <p className="eyebrow m-0 mb-1 text-[11px] text-gold-700">Nota del docente</p>
                <p className="m-0 whitespace-pre-line text-[15px]">{current.note}</p>
              </div>
            )}
            {current.items.length === 0 && <p className="text-muted">El docente aún no ha publicado materiales para esta semana.</p>}
            {current.items.map((it, i) => (
              <ResourceCard key={it.id} r={it.resource} role={it.role} index={i + 1} />
            ))}
          </>
        )}

        <div className="mt-6 flex items-center gap-4 rounded-lg border border-line bg-white p-4">
          <QrCode url={url} size={88} label={`Código QR de este curso`} />
          <p className="m-0 text-sm text-muted">Comparte este curso con tus compañeros: escanea el código o copia el enlace del navegador.</p>
        </div>
        <p className="mt-4 text-center text-xs text-muted">
          Hecho con <Link href="/" className="font-semibold">sílaba</Link> · No necesitas cuenta para ver este curso
        </p>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "@/components/brand";
import { requireProfile } from "@/lib/panel";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile({ allowIncomplete: true });
  const nav = [
    ["/panel", "Inicio"],
    ["/panel/temas", "Recursos y temas"],
    ["/panel/cursos", "Cursos"],
    ["/panel/perfil", "Mi perfil"],
    ["/panel/portafolio", "Portafolio"],
  ];
  return (
    <div className="flex min-h-screen flex-wrap bg-ivory print:bg-white">
      <nav aria-label="Panel" className="print:hidden flex flex-[1_1_240px] flex-col gap-1 border-b border-line bg-white px-4 py-5 md:max-w-[260px] md:border-b-0 md:border-r">
        <div className="px-3 pb-5"><Logo size={24} /></div>
        {nav.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-md px-3 py-2.5 text-[15px] text-ink no-underline hover:bg-ivory">
            {label}
          </Link>
        ))}
        {profile.handle && (
          <Link href={`/${profile.handle}`} className="rounded-md px-3 py-2.5 text-[15px] text-navy-900 no-underline hover:bg-ivory">
            Ver mi perfil público ↗
          </Link>
        )}
        <div className="mt-auto flex items-center gap-2.5 border-t border-line px-3 pt-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-serif text-[13px] font-semibold text-white">
            {(profile.full_name ?? "?").split(/\s+/).slice(0, 2).map((w) => w[0]).join("")}
          </span>
          <span className="min-w-0 grow text-sm leading-tight">
            <b className="block truncate">{profile.full_name ?? "Tu perfil"}</b>
            <span className="text-muted">Plan {profile.plan === "pro" ? "Pro" : "Gratis"}</span>
          </span>
          <form action="/auth/salir" method="post">
            <button className="cursor-pointer border-0 bg-transparent p-1 text-sm text-muted underline">Salir</button>
          </form>
        </div>
      </nav>
      <main className="min-w-0 flex-[999_1_560px] px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}

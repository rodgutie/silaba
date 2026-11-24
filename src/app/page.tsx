import Link from "next/link";
import { Logo, QrCode, Seal, SiteFooter } from "@/components/brand";
import { SITE_URL } from "@/lib/utils";

const steps = [
  ["Reúne", "Guarda en segundos cada lectura, enlace, video o conferencia que encuentres, desde el celular o la computadora."],
  ["Desarrolla", "Organiza todo en líneas temáticas y escribe tus propias notas e ideas. Tu hilo conductor, construido por ti."],
  ["Comparte", "Arma cursos por semana con lo que ya tienes y muestra tu trayectoria en tu perfil público. Tus estudiantes entran sin registrarse."],
];

export default function Home() {
  return (
    <div className="bg-ivory">
      {/* Hero */}
      <section className="dg relative overflow-hidden bg-navy-900 text-white">
        <div className="border-b border-gold-500/35">
          <nav className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-6 py-5">
            <Logo light size={28} />
            <div className="flex grow flex-wrap gap-7 text-[15px]">
              <a href="#metodo" className="nl">Cómo funciona</a>
              <a href="#estudiantes" className="nl">Para estudiantes</a>
              <a href="#planes" className="nl">Planes</a>
            </div>
            <Link href="/entrar" className="nl px-1 py-2.5 text-[15px]">Entrar</Link>
            <Link href="/entrar" className="btn btn-gold">Crear perfil gratis</Link>
          </nav>
        </div>

        <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-6 pb-[220px] pt-[88px]">
          <div className="min-w-0 flex-[1_1_620px]">
            <p className="eyebrow mb-7 flex items-center gap-3.5 text-gold-500">
              <span aria-hidden className="h-px w-12 bg-gold-500" />
              Para docentes y educadores
            </p>
            <h1 className="mb-7 font-serif text-[42px] font-medium leading-[1.02] tracking-[-0.02em] [text-wrap:balance] md:text-[72px]">
              Lo que lees, lo que piensas y lo que enseñas, en <em className="text-gold-500">un solo lugar</em>.
            </h1>
            <p className="mb-10 max-w-[580px] text-xl leading-relaxed text-mist">
              Reúne tus recursos, desarrolla tus temas y comparte tus cursos y charlas. Para quien enseña en una universidad,
              un colegio, un instituto o por cuenta propia.
            </p>
            <form action="/entrar" className="flex max-w-[600px] flex-wrap gap-2.5">
              <label htmlFor="claim" className="eyebrow w-full text-[13px] text-[#E8ECF3]">Reserva tu dirección</label>
              <div className="flex min-h-[58px] flex-[1_1_300px] items-center rounded bg-ivory px-4">
                <span className="text-muted">silaba.io/</span>
                <input id="claim" name="handle" placeholder="tu-nombre" pattern="[a-z0-9-]{3,40}" className="min-w-20 grow border-0 bg-transparent py-3.5 text-ink outline-none" />
              </div>
              <button className="btn btn-gold min-h-[58px] px-6">Crear perfil gratis</button>
              <p className="mt-2 w-full text-sm text-[#A9B6CB]">Gratis para siempre: perfil y un curso. Sin tarjeta.</p>
            </form>
          </div>
          <div className="hidden min-w-0 flex-[0_1_340px] justify-center md:flex"><Seal /></div>
        </div>
      </section>

      {/* Product shot overlapping the hero */}
      <section className="px-6">
        <div className="lift relative mx-auto -mt-[170px] max-w-[1040px] overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_24px_60px_rgba(19,41,75,.25)]">
          <div className="flex items-center gap-3 border-b border-line bg-[#EFEBE1] px-4 py-2.5">
            <span className="max-w-[420px] grow rounded border border-line bg-white px-3 py-1 text-[13px] text-muted">
              silaba.io/<b className="text-ink">tu-nombre</b>
            </span>
          </div>
          <div className="dg relative h-[150px] overflow-hidden bg-navy-700">
            <div aria-hidden className="absolute -top-[70px] right-[60px] h-[220px] w-[220px] rounded-full border-[1.5px] border-gold-500" />
          </div>
          <div className="flex flex-wrap gap-8 px-9 pb-8">
            <div className="min-w-0 flex-[1_1_280px]">
              <div className="relative -mt-14 flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-white bg-navy-900 font-serif text-4xl font-semibold text-white">MV</div>
              <p className="mb-0.5 mt-3.5 font-serif text-[26px] font-semibold leading-tight">María Vargas</p>
              <p className="mb-1.5 text-[15px] text-muted">Docente de Administración de Empresas</p>
              <p className="eyebrow text-[13px] text-gold-700">Estrategia · Innovación · Ética</p>
            </div>
            <div className="flex min-w-0 flex-[2_1_420px] flex-col pt-6">
              <p className="eyebrow mb-1 text-xs text-gold-700">Cursos y temas</p>
              {[
                ["Administración Estratégica", "2 instituciones · Semana 3"],
                ["Gestión de Proyectos", "1 institución · Semana 3"],
                ["Líneas temáticas: Estrategia · Innovación", "Recursos y notas"],
              ].map(([a, b], i) => (
                <div key={a} className={`flex justify-between gap-4 py-3.5 ${i < 2 ? "border-b border-line" : ""}`}>
                  <span className={`font-serif text-[19px] font-medium ${i === 2 ? "text-muted" : ""}`}>{a}</span>
                  <span className="text-[13px] text-muted">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* I. Problem */}
      <section className="mx-auto flex max-w-[1200px] flex-wrap gap-16 px-6 pb-[104px] pt-[120px]">
        <div className="flex-[0_0_120px] font-serif text-[22px] text-gold-700">I.</div>
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="mb-5 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.015em] [text-wrap:balance] md:text-[46px]">
            Lees, investigas y enseñas todos los días. Pero ese conocimiento se pierde entre carpetas, correos y plataformas que se cierran.
          </p>
          <p className="max-w-[640px] text-[19px] text-muted">
            Sílaba es tu espacio propio: reúnes lo que encuentras, le das un hilo conductor en tus líneas temáticas y lo conviertes en
            cursos, charlas y una trayectoria que se acumula con los años.
          </p>
        </div>
      </section>

      {/* II. Method */}
      <section id="metodo" className="border-y border-line bg-white px-6 py-[104px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-16">
          <div className="flex-[0_0_120px] font-serif text-[22px] text-gold-700">II.</div>
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className="mb-10 font-serif text-[34px] font-medium tracking-[-0.015em] md:text-[44px]">Reúne · Desarrolla · Comparte</h2>
            <ol className="m-0 list-none p-0">
              {steps.map(([t, d], i) => (
                <li key={t} className={`flex flex-wrap gap-6 py-7 ${i === 0 ? "border-t border-gold-500" : "border-t border-line"} ${i === 2 ? "border-b border-line" : ""}`}>
                  <span className="flex-[0_0_64px] font-serif text-[40px] italic leading-none text-gold-500">{i + 1}</span>
                  <span className="flex-[1_1_280px]">
                    <b className="mb-1 block font-serif text-2xl font-semibold">{t}</b>
                    <span className="text-muted">{d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* III. Students */}
      <section id="estudiantes" className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-16 px-6 py-[104px]">
        <div className="flex-[0_0_120px] self-start font-serif text-[22px] text-gold-700">III.</div>
        <div className="min-w-0 flex-[1_1_400px]">
          <h2 className="mb-4 font-serif text-[32px] font-medium leading-[1.12] tracking-[-0.015em] md:text-[42px]">Para tus estudiantes, una semana a la vez</h2>
          <p className="mb-7 text-[19px] text-muted">
            Cada semana reúne las lecturas, los videos y tu nota. Saben qué leer y para cuándo, desde cualquier teléfono y sin crear cuentas.
          </p>
          <div className="mb-7 flex max-w-[520px] items-center gap-4 rounded-[10px] border border-line bg-white p-4">
            <QrCode url={SITE_URL} size={104} label="Código QR de ejemplo" />
            <p className="m-0 text-base text-[#2D3748]">
              <b className="block font-serif text-[19px] text-ink">Un código QR por curso y por perfil</b>
              Proyéctalo en clase o imprímelo en el programa: tus estudiantes entran al instante.
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-[0_1_300px] justify-center">
          <div className="lift w-[270px] rounded-[36px] bg-navy-900 p-2.5 shadow-[0_20px_48px_rgba(19,41,75,.25)]">
            <div className="flex flex-col gap-2.5 rounded-[28px] bg-ivory px-4 py-5">
              <p className="eyebrow m-0 text-[11px] text-gold-700">Semana 3</p>
              <p className="mb-1 font-serif text-xl font-semibold leading-tight">Ventaja competitiva</p>
              <div className="border-l-2 border-gold-500 py-0.5 pl-2.5 text-[13px] italic text-muted">«Lean la lectura 1 antes del jueves.»</div>
              <div className="rounded-md border border-line bg-white p-2.5">
                <p className="eyebrow m-0 text-[10px] text-navy-900">Lectura 1</p>
                <p className="mt-0.5 font-serif text-sm font-semibold">The Five Competitive Forces That Shape Strategy</p>
              </div>
              <div className="flex h-[84px] items-center justify-center rounded-md bg-navy-900 text-xs text-white">▶ Video · 12 min</div>
              <div className="rounded-md border border-line bg-white p-2.5 text-[13px] font-semibold">Guía de lectura · PDF</div>
            </div>
          </div>
        </div>
      </section>

      {/* IV. Copyright */}
      <section className="dg bg-navy-900 px-6 py-[104px] text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap gap-16">
          <div className="flex-[0_0_120px] font-serif text-[22px] text-gold-500">IV.</div>
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className="mb-4 font-serif text-[34px] font-medium tracking-[-0.015em] md:text-[44px]">Respeto a los derechos de autor, por diseño</h2>
            <p className="mb-12 max-w-[640px] text-[19px] text-mist">Compartir conocimiento sin preocuparte por lo legal: Sílaba distingue entre tu obra y la de otros autores.</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-10">
              <div className="border-t border-gold-500 pt-5">
                <p className="mb-2 font-serif text-[26px]">Tu obra se publica</p>
                <p className="m-0 text-mist">Guías, presentaciones, casos y apuntes propios, con la licencia que elijas.</p>
              </div>
              <div className="border-t border-gold-500 pt-5">
                <p className="mb-2 font-serif text-[26px]">La obra de otros se cita</p>
                <p className="m-0 text-mist">Artículos, libros y videos enlazan a su fuente original, indicando si son de acceso libre.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI stance */}
      <section className="mx-auto max-w-[1200px] px-6 py-[104px] text-center">
        <div aria-hidden className="mx-auto mb-7 h-px w-16 bg-gold-500" />
        <p className="mx-auto max-w-[860px] font-serif text-[30px] italic leading-[1.22] text-navy-900 md:text-[42px]">
          «Sílaba no piensa por ti. Te ayuda a no perder lo que piensas.»
        </p>
        <p className="mx-auto mt-6 max-w-[620px] text-lg text-muted">
          Tus argumentos son tuyos. La tecnología solo se encarga de lo tedioso: completar fichas, ordenar y encontrar lo que ya guardaste.
        </p>
      </section>

      {/* Plans */}
      <section id="planes" className="border-t border-line bg-white px-6 py-[104px]">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="mb-2 text-center font-serif text-[44px] font-medium tracking-[-0.015em]">Planes</h2>
          <p className="mb-12 text-center text-lg text-muted">Empieza gratis. Pasa a Pro cuando enseñes más de un curso.</p>
          <div className="flex flex-wrap justify-center gap-7">
            <div className="lift flex max-w-[460px] flex-[1_1_340px] flex-col gap-4 border-t-[3px] border-navy-900 bg-ivory p-10">
              <p className="eyebrow m-0 text-muted">Gratis</p>
              <p className="m-0"><span className="font-serif text-[56px] leading-none">$0</span> <span className="text-muted">para siempre</span></p>
              <ul className="m-0 list-none p-0">
                {["Perfil con foto y portada", "Un curso", "Código QR para compartir", "Líneas temáticas, enlaces, DOI y videos"].map((x, i, a) => (
                  <li key={x} className={`border-t border-line py-2.5 ${i === a.length - 1 ? "border-b" : ""}`}>{x}</li>
                ))}
              </ul>
              <Link href="/entrar" className="btn btn-line mt-auto">Crear perfil gratis</Link>
            </div>
            <div className="lift dg flex max-w-[460px] flex-[1_1_340px] flex-col gap-4 border-t-[3px] border-gold-500 bg-navy-900 p-10 text-white">
              <p className="m-0 flex justify-between gap-3"><span className="eyebrow text-gold-500">Pro</span><span className="text-[13px] text-mist">Anual: 2 meses gratis</span></p>
              <p className="m-0"><span className="font-serif text-[56px] leading-none">$9.99</span> <span className="text-mist">/ mes · o $99 / año</span></p>
              <ul className="m-0 list-none p-0">
                {["Cursos ilimitados", "Un curso en varias instituciones", "Portafolio académico en PDF", "Tus documentos propios", "Copiar un curso al siguiente ciclo"].map((x, i, a) => (
                  <li key={x} className={`border-t border-gold-500/40 py-2.5 ${i === a.length - 1 ? "border-b" : ""}`}>{x}</li>
                ))}
              </ul>
              <Link href="/entrar" className="btn btn-gold mt-auto">Empezar con Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="dg bg-navy-900 px-6 py-24 text-center text-white">
        <p aria-hidden className="mb-5 font-serif text-[22px] tracking-[0.4em] text-gold-500">sí · la · ba</p>
        <h2 className="mx-auto mb-8 max-w-[820px] font-serif text-[34px] font-medium leading-[1.1] tracking-[-0.015em] md:text-[48px]">
          Tu espacio te espera: silaba.io/<em className="text-gold-500">tu-nombre</em>
        </h2>
        <Link href="/entrar" className="btn btn-gold min-h-[56px] px-8 text-[17px]">Crear perfil gratis</Link>
      </section>

      <SiteFooter />
    </div>
  );
}

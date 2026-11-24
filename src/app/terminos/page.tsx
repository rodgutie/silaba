import type { Metadata } from "next";
import { PublicHeader, SiteFooter } from "@/components/brand";

export const metadata: Metadata = { title: "Términos y derechos de autor" };

// BORRADOR — revisar con un abogado de propiedad intelectual antes del lanzamiento.
export default function Terminos() {
  return (
    <div className="bg-ivory">
      <PublicHeader />
      <main className="mx-auto max-w-[720px] px-6 py-16">
        <p className="eyebrow text-gold-700">Borrador</p>
        <h1 className="mt-2 font-serif text-4xl font-medium">Términos de uso y derechos de autor</h1>
        <h2 className="mt-10 font-serif text-2xl font-medium">Lo que publicas</h2>
        <p>Solo puedes subir material propio o material que tengas derecho a compartir. Al subir un documento declaras que eres su autor o que cuentas con autorización, y eliges la licencia con la que se comparte.</p>
        <h2 className="mt-10 font-serif text-2xl font-medium">Obras de otros autores</h2>
        <p>Los artículos, libros y videos de otros autores se agregan como enlace a su fuente original. Sílaba no aloja copias de esas obras.</p>
        <h2 className="mt-10 font-serif text-2xl font-medium">Reportar contenido</h2>
        <p>Si crees que un material infringe tus derechos, escríbenos a <a href="mailto:hola@silaba.io">hola@silaba.io</a> con el enlace del contenido. Lo revisaremos y, si corresponde, lo retiraremos.</p>
        <h2 className="mt-10 font-serif text-2xl font-medium">Tus datos</h2>
        <p>Tu perfil y los cursos que publiques son públicos. Tus recursos, notas y líneas temáticas son privados hasta que decidas publicarlos. Los estudiantes no necesitan cuenta.</p>
      </main>
      <SiteFooter />
    </div>
  );
}

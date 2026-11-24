import Link from "next/link";
import { Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ivory px-6 text-center">
      <Logo size={32} />
      <h1 className="m-0 font-serif text-4xl font-medium">No encontramos esta página</h1>
      <p className="m-0 max-w-md text-muted">Puede que el perfil o el curso no exista o que aún no esté publicado.</p>
      <Link href="/" className="btn btn-navy">Ir al inicio</Link>
    </div>
  );
}

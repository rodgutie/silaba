export type Plan = "free" | "pro";

export type Profile = {
  id: string;
  handle: string | null;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  specialties: string[];
  institutions: string[];
  links: { label: string; url: string }[];
  plan: Plan;
};

export type ResourceKind = "link" | "article" | "video" | "lecture" | "document";
export type Access = "open" | "subscription" | "unknown" | "own";

export type Resource = {
  id: string;
  owner: string;
  theme_id: string | null;
  kind: ResourceKind;
  title: string;
  authors: string | null;
  year: number | null;
  source: string | null;
  url: string | null;
  doi: string | null;
  access: Access;
  note: string | null;
  file_path: string | null;
  license: string | null;
  is_public: boolean;
  created_at: string;
};

export type Theme = { id: string; owner: string; name: string; description: string | null; is_public: boolean; created_at: string };
export type Note = { id: string; owner: string; theme_id: string | null; title: string; body: string; is_public: boolean; created_at: string };

export type Course = {
  id: string;
  owner: string;
  slug: string;
  title: string;
  description: string | null;
  term: string | null;
  institutions: string[];
  is_published: boolean;
  created_at: string;
};
export type Week = { id: string; course_id: string; number: number; title: string | null; note: string | null; dates: string | null };
export type ItemRole = "required" | "complementary" | "support";
export type CourseItem = { id: string; week_id: string; resource_id: string; role: ItemRole; position: number; resource?: Resource };

export const KIND_LABEL: Record<ResourceKind, string> = {
  link: "Enlace",
  article: "Artículo",
  video: "Video",
  lecture: "Conferencia",
  document: "Documento",
};
export const ROLE_LABEL: Record<ItemRole, string> = {
  required: "Lectura obligatoria",
  complementary: "Complementaria",
  support: "Recurso de apoyo",
};
export const ACCESS_LABEL: Record<Access, string> = {
  open: "Acceso libre",
  subscription: "Puede requerir suscripción",
  unknown: "",
  own: "Material propio",
};

/** Paths that can never be used as a public handle. */
export const RESERVED_HANDLES = new Set([
  "entrar", "panel", "auth", "api", "precios", "planes", "terminos", "derechos-de-autor",
  "reportar", "admin", "ayuda", "contacto", "silaba", "www", "app", "_next",
]);

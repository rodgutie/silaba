"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/panel";
import { RESERVED_HANDLES, type Access, type ItemRole, type ResourceKind } from "@/lib/types";
import { extractDoi, isVideoUrl, lookupDoi, slugify } from "@/lib/utils";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 12);
const done = () => revalidatePath("/panel", "layout");

// ───────────── Profile ─────────────

export async function saveProfile(formData: FormData) {
  const { supabase, user, profile } = await requireProfile({ allowIncomplete: true });
  const handle = str(formData, "handle").toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{2,39}$/.test(handle) || RESERVED_HANDLES.has(handle)) {
    redirect("/panel/perfil?error=handle");
  }
  const links = str(formData, "links")
    .split("\n")
    .map((line) => line.split("|").map((x) => x.trim()))
    .filter(([label, url]) => label && url && /^https?:\/\//.test(url))
    .map(([label, url]) => ({ label, url }))
    .slice(0, 8);

  const update: Record<string, unknown> = {
    handle,
    full_name: str(formData, "full_name") || null,
    headline: str(formData, "headline") || null,
    location: str(formData, "location") || null,
    bio: str(formData, "bio") || null,
    specialties: list(str(formData, "specialties")),
    institutions: list(str(formData, "institutions")),
    links,
  };
  const avatar = str(formData, "avatar_url");
  const cover = str(formData, "cover_url");
  if (avatar) update.avatar_url = avatar;
  if (cover) update.cover_url = cover;

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);
  if (error) redirect(`/panel/perfil?error=${error.code === "23505" ? "taken" : "save"}`);
  done();
  redirect(profile.handle ? "/panel/perfil?ok=1" : "/panel?bienvenida=1");
}

// ───────────── Themes, resources, notes ─────────────

export async function createTheme(formData: FormData) {
  const { supabase, user } = await requireProfile();
  const name = str(formData, "name");
  if (!name) return;
  const { data } = await supabase
    .from("themes")
    .insert({ owner: user.id, name, description: str(formData, "description") || null })
    .select("id")
    .single();
  done();
  if (data) redirect(`/panel/temas/${data.id}`);
}

export async function updateTheme(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase
    .from("themes")
    .update({ name: str(formData, "name"), description: str(formData, "description") || null, is_public: formData.get("is_public") === "on" })
    .eq("id", str(formData, "id"));
  done();
}

export async function deleteTheme(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase.from("themes").delete().eq("id", str(formData, "id"));
  done();
  redirect("/panel/temas");
}

/** Only fetch public web pages (no localhost or raw IP addresses). */
function isSafePublicUrl(url: string) {
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return false;
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
    if (/^[\d.]+$/.test(h) || h.includes(":")) return false; // IPv4 / IPv6 literals
    return h.includes(".");
  } catch {
    return false;
  }
}

async function pageTitle(url: string): Promise<string | null> {
  if (!isSafePublicUrl(url)) return null;
  try {
    const oembed = /youtu\.?be/.test(url)
      ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`
      : /vimeo\.com/.test(url)
        ? `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`
        : null;
    if (oembed) {
      const r = await fetch(oembed, { signal: AbortSignal.timeout(5000) });
      if (r.ok) return (await r.json()).title ?? null;
      return null;
    }
    const r = await fetch(url, { signal: AbortSignal.timeout(5000), headers: { "User-Agent": "Mozilla/5.0 silaba.io" } });
    const html = (await r.text()).slice(0, 200_000);
    const m = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i) ?? html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return m ? m[1].trim().replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').slice(0, 300) : null;
  } catch {
    return null;
  }
}

/** Builds a resource from a pasted link or DOI (title and citation filled in automatically). */
async function buildResource(input: string, kindHint: string, titleHint: string) {
  const doi = extractDoi(input);
  if (doi && !/^https?:\/\/(?!doi\.org|dx\.doi\.org)/i.test(input)) {
    const info = await lookupDoi(doi);
    return {
      kind: "article" as ResourceKind,
      title: titleHint || info?.title || doi,
      authors: info?.authors ?? null,
      year: info?.year ?? null,
      source: info?.source ?? null,
      url: info?.url ?? `https://doi.org/${doi}`,
      doi,
      access: (info?.open === true ? "open" : info?.open === false ? "subscription" : "unknown") as Access,
    };
  }
  const url = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const kind: ResourceKind = kindHint === "lecture" ? "lecture" : isVideoUrl(url) ? "video" : "link";
  return {
    kind,
    title: titleHint || (await pageTitle(url)) || url.replace(/^https?:\/\//, "").slice(0, 120),
    authors: null,
    year: null,
    source: new URL(url).hostname.replace(/^www\./, ""),
    url,
    doi: null,
    access: "unknown" as Access,
  };
}

/** Quick capture: paste a link or DOI. Optionally adds it straight into a course week. */
export async function addResource(formData: FormData) {
  const { supabase, user } = await requireProfile();
  const input = str(formData, "input");
  if (!input) return;
  const base = await buildResource(input, str(formData, "kind"), str(formData, "title"));
  const { data } = await supabase
    .from("resources")
    .insert({ ...base, owner: user.id, theme_id: str(formData, "theme_id") || null, note: str(formData, "note") || null })
    .select("id")
    .single();
  const weekId = str(formData, "week_id");
  if (data && weekId) await addItemRow(supabase, weekId, data.id, (str(formData, "role") || "required") as ItemRole);
  done();
}

/** Registers a document that the browser already uploaded to Storage (Pro). */
export async function addDocument(formData: FormData) {
  const { supabase, user, profile } = await requireProfile();
  if (profile.plan !== "pro") return;
  const path = str(formData, "file_path");
  if (!path.startsWith(`${user.id}/`) || formData.get("declaration") !== "on") return;
  const { data } = await supabase
    .from("resources")
    .insert({
      owner: user.id,
      kind: "document",
      title: str(formData, "title") || path.split("/").pop()!,
      file_path: path,
      license: str(formData, "license") || null,
      access: "own",
      theme_id: str(formData, "theme_id") || null,
      note: str(formData, "note") || null,
    })
    .select("id")
    .single();
  const weekId = str(formData, "week_id");
  if (data && weekId) await addItemRow(supabase, weekId, data.id, (str(formData, "role") || "support") as ItemRole);
  done();
}

export async function updateResource(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase
    .from("resources")
    .update({ theme_id: str(formData, "theme_id") || null, is_public: formData.get("is_public") === "on", note: str(formData, "note") || null })
    .eq("id", str(formData, "id"));
  done();
}

export async function deleteResource(formData: FormData) {
  const { supabase } = await requireProfile();
  const id = str(formData, "id");
  const { data } = await supabase.from("resources").select("file_path").eq("id", id).maybeSingle();
  if (data?.file_path) await supabase.storage.from("documents").remove([data.file_path]);
  await supabase.from("resources").delete().eq("id", id);
  done();
}

export async function addNote(formData: FormData) {
  const { supabase, user } = await requireProfile();
  const title = str(formData, "title");
  if (!title) return;
  await supabase.from("notes").insert({
    owner: user.id,
    theme_id: str(formData, "theme_id") || null,
    title,
    body: str(formData, "body"),
    is_public: formData.get("is_public") === "on",
  });
  done();
}

export async function updateNote(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase
    .from("notes")
    .update({ title: str(formData, "title"), body: str(formData, "body"), is_public: formData.get("is_public") === "on" })
    .eq("id", str(formData, "id"));
  done();
}

export async function deleteNote(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase.from("notes").delete().eq("id", str(formData, "id"));
  done();
}

// ───────────── Courses ─────────────

export async function createCourse(formData: FormData) {
  const { supabase, user } = await requireProfile();
  const title = str(formData, "title");
  if (!title) return;
  const weeks = Math.min(Math.max(Number(str(formData, "weeks")) || 12, 1), 30);
  const { data, error } = await supabase
    .from("courses")
    .insert({
      owner: user.id,
      title,
      slug: `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`,
      term: str(formData, "term") || null,
      institutions: list(str(formData, "institutions")),
    })
    .select("id")
    .single();
  if (error || !data) redirect("/panel/cursos?error=limite");
  await supabase.from("course_weeks").insert(Array.from({ length: weeks }, (_, i) => ({ course_id: data.id, number: i + 1 })));
  done();
  redirect(`/panel/cursos/${data.id}`);
}

export async function updateCourse(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase
    .from("courses")
    .update({
      title: str(formData, "title"),
      description: str(formData, "description") || null,
      term: str(formData, "term") || null,
      institutions: list(str(formData, "institutions")),
      is_published: formData.get("is_published") === "on",
    })
    .eq("id", str(formData, "id"));
  done();
}

export async function deleteCourse(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase.from("courses").delete().eq("id", str(formData, "id"));
  done();
  redirect("/panel/cursos");
}

/** Pro: copies a course (weeks, notes and materials) for the next term. */
export async function duplicateCourse(formData: FormData) {
  const { supabase, user, profile } = await requireProfile();
  if (profile.plan !== "pro") redirect("/panel/cursos?error=pro");
  const { data: src } = await supabase
    .from("courses")
    .select("*, course_weeks(*, course_items(*))")
    .eq("id", str(formData, "id"))
    .single();
  if (!src) return;
  const { data: copy } = await supabase
    .from("courses")
    .insert({
      owner: user.id,
      title: src.title,
      description: src.description,
      term: str(formData, "term") || null,
      institutions: src.institutions,
      slug: `${slugify(src.title)}-${Math.random().toString(36).slice(2, 6)}`,
    })
    .select("id")
    .single();
  if (!copy) return;
  for (const w of src.course_weeks as { number: number; title: string | null; note: string | null; course_items: { resource_id: string; role: string; position: number }[] }[]) {
    const { data: nw } = await supabase
      .from("course_weeks")
      .insert({ course_id: copy.id, number: w.number, title: w.title, note: w.note })
      .select("id")
      .single();
    if (nw && w.course_items.length)
      await supabase.from("course_items").insert(w.course_items.map((i) => ({ week_id: nw.id, resource_id: i.resource_id, role: i.role, position: i.position })));
  }
  done();
  redirect(`/panel/cursos/${copy.id}`);
}

export async function updateWeek(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase
    .from("course_weeks")
    .update({ title: str(formData, "title") || null, dates: str(formData, "dates") || null, note: str(formData, "note") || null })
    .eq("id", str(formData, "id"));
  done();
}

export async function addWeek(formData: FormData) {
  const { supabase } = await requireProfile();
  const courseId = str(formData, "course_id");
  const { data } = await supabase.from("course_weeks").select("number").eq("course_id", courseId).order("number", { ascending: false }).limit(1);
  await supabase.from("course_weeks").insert({ course_id: courseId, number: (data?.[0]?.number ?? 0) + 1 });
  done();
}

async function addItemRow(supabase: Awaited<ReturnType<typeof requireProfile>>["supabase"], weekId: string, resourceId: string, role: ItemRole) {
  const { count } = await supabase.from("course_items").select("id", { count: "exact", head: true }).eq("week_id", weekId);
  await supabase.from("course_items").insert({ week_id: weekId, resource_id: resourceId, role, position: count ?? 0 });
}

/** Adds an item from the professor's library to a week. */
export async function addItemFromLibrary(formData: FormData) {
  const { supabase } = await requireProfile();
  const resourceId = str(formData, "resource_id");
  if (!resourceId) return;
  await addItemRow(supabase, str(formData, "week_id"), resourceId, (str(formData, "role") || "required") as ItemRole);
  done();
}

export async function removeItem(formData: FormData) {
  const { supabase } = await requireProfile();
  await supabase.from("course_items").delete().eq("id", str(formData, "id"));
  done();
}

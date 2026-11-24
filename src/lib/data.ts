import { createClient } from "@/lib/supabase/server";
import type { Course, CourseItem, Note, Profile, Resource, Theme, Week } from "@/lib/types";

export type WeekWithItems = Week & { items: (CourseItem & { resource: Resource })[] };

export async function getProfileByHandle(handle: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("handle", handle.toLowerCase()).maybeSingle();
  return data as Profile | null;
}

/** Published courses, public themes and public notes of a profile. */
export async function getPublicProfileContent(ownerId: string) {
  const supabase = await createClient();
  const [courses, themes, notes] = await Promise.all([
    supabase.from("courses").select("*").eq("owner", ownerId).eq("is_published", true).order("created_at", { ascending: false }),
    supabase.from("themes").select("*").eq("owner", ownerId).eq("is_public", true).order("name"),
    supabase.from("notes").select("*").eq("owner", ownerId).eq("is_public", true).order("created_at", { ascending: false }).limit(6),
  ]);
  return {
    courses: (courses.data ?? []) as Course[],
    themes: (themes.data ?? []) as Theme[],
    notes: (notes.data ?? []) as Note[],
  };
}

/** A course with its weeks, items and resources, sorted. */
export async function getCourseWithWeeks(filter: { id?: string; owner?: string; slug?: string }) {
  const supabase = await createClient();
  let q = supabase.from("courses").select("*, course_weeks(*, course_items(*, resource:resources(*)))");
  if (filter.id) q = q.eq("id", filter.id);
  if (filter.owner) q = q.eq("owner", filter.owner);
  if (filter.slug) q = q.eq("slug", filter.slug);
  const { data } = await q.maybeSingle();
  if (!data) return null;
  const { course_weeks, ...course } = data as Course & { course_weeks: (Week & { course_items: (CourseItem & { resource: Resource })[] })[] };
  const weeks: WeekWithItems[] = (course_weeks ?? [])
    .map(({ course_items, ...w }) => ({ ...w, items: (course_items ?? []).filter((i) => i.resource).sort((a, b) => a.position - b.position) }))
    .sort((a, b) => a.number - b.number);
  return { course: course as Course, weeks };
}

export function publicFileUrl(bucket: "documents" | "media", path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/** Signed-in professor + profile. Sends to sign-in, or to profile setup if the handle is missing. */
export async function requireProfile({ allowIncomplete = false } = {}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
  if (!profile) redirect("/entrar?error=1");
  if (!allowIncomplete && !profile.handle) redirect("/panel/perfil");
  return { supabase, user: data.user, profile: profile as Profile };
}

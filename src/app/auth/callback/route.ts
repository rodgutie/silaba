import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Finishes sign-in (magic link or Google/Microsoft) and sends the user on. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/panel";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/panel";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/entrar?error=1`);
}

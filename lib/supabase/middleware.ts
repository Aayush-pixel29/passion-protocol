import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/onboarding", "/discover", "/profile", "/messages", "/workspace"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED.some((p) => path === p || path.startsWith(`${p}/`));

  if (!user && isProtected) {
    const redirect = request.nextUrl.clone();
    redirect.pathname = "/login";
    return NextResponse.redirect(redirect);
  }

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .maybeSingle();

    const complete = Boolean(profile?.onboarding_complete);

    if (
      !complete &&
      (path === "/discover" ||
        path === "/profile" ||
        path === "/messages" ||
        path.startsWith("/discover/") ||
        path.startsWith("/profile/") ||
        path.startsWith("/messages/") ||
        path.startsWith("/workspace/"))
    ) {
      const redirect = request.nextUrl.clone();
      redirect.pathname = "/onboarding";
      return NextResponse.redirect(redirect);
    }

    if (path === "/login") {
      const redirect = request.nextUrl.clone();
      redirect.pathname = complete ? "/discover" : "/onboarding";
      return NextResponse.redirect(redirect);
    }
  }

  return supabaseResponse;
}

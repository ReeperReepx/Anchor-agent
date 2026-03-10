import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/home", "/login", "/onboarding", "/auth/callback"];
const PUBLIC_PREFIXES = ["/blog"];
// Routes that require auth but NOT a subscription
const NO_SUB_REQUIRED = ["/pricing", "/settings", "/api/stripe/", "/api/subscription", "/api/onboarding", "/api/calendar/"];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isPublicRoute) return NextResponse.next({ request });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Check subscription for protected routes (skip public, pricing, settings, API)
  if (user && !isPublicRoute && !NO_SUB_REQUIRED.some((r) => pathname.startsWith(r))) {
    // Check if user is grandfathered (created before cutoff)
    const { data: profile } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", user.id)
      .single();

    const GRANDFATHER_CUTOFF = "2026-03-07T23:00:00Z";
    const isGrandfathered = profile && profile.created_at < GRANDFATHER_CUTOFF;

    if (!isGrandfathered) {
      // Check for active subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, trial_ends_at")
        .eq("user_id", user.id)
        .single();

      const hasActiveSub =
        sub &&
        (sub.status === "active" ||
          (sub.status === "trialing" &&
            sub.trial_ends_at &&
            new Date(sub.trial_ends_at) > new Date()));

      if (!hasActiveSub) {
        const url = request.nextUrl.clone();
        url.pathname = "/pricing";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

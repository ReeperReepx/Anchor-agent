import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const product = searchParams.get("product"); // "matching" or null

  if (code) {
    const responseHeaders = new Headers();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return parseCookies(request.headers.get("cookie") ?? "");
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookie = serializeCookie(name, value, options);
              responseHeaders.append("set-cookie", cookie);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let redirectTo = `${origin}/dashboard`;

      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("onboarded_at, product_type")
          .eq("id", user.id)
          .single();

        if (!profile?.onboarded_at) {
          // New user — route to the right onboarding based on query param
          redirectTo = product === "matching"
            ? `${origin}/onboarding/matching`
            : `${origin}/onboarding`;
        } else {
          // Returning user — route based on their stored product type
          const userProduct = profile.product_type ?? "standup";
          redirectTo = userProduct === "matching"
            ? `${origin}/match-dashboard`
            : `${origin}/dashboard`;
        }
      }

      // Set a cookie with the product type so client can read it as fallback
      if (product === "matching") {
        responseHeaders.append(
          "set-cookie",
          serializeCookie("anchor_product", "matching", {
            path: "/",
            maxAge: 3600, // 1 hour, just needs to survive through onboarding
            sameSite: "lax",
          })
        );
      }

      const response = NextResponse.redirect(redirectTo);
      responseHeaders.forEach((value, key) => {
        response.headers.append(key, value);
      });
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

function parseCookies(cookieHeader: string) {
  return cookieHeader
    .split(";")
    .filter(Boolean)
    .map((pair) => {
      const [name, ...rest] = pair.trim().split("=");
      return { name, value: rest.join("=") };
    });
}

function serializeCookie(
  name: string,
  value: string,
  options?: Record<string, unknown>
): string {
  let cookie = `${name}=${value}`;
  if (!options) return cookie;

  if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
  if (options.domain) cookie += `; Domain=${options.domain}`;
  if (options.path) cookie += `; Path=${options.path}`;
  else cookie += "; Path=/";
  if (options.httpOnly) cookie += "; HttpOnly";
  if (options.secure) cookie += "; Secure";
  if (options.sameSite) {
    const sameSite = String(options.sameSite);
    cookie += `; SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`;
  }
  return cookie;
}

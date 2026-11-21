import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  consumeLoginChallenge,
  openAdminLoginRequest,
  type SealedLoginBody,
} from "@/lib/crypto/admin-login-server";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  hasSupabaseCredentials,
} from "@/lib/supabase/env";

const FAIL = { error: "Invalid credentials" };

export async function POST(request: Request) {
  if (!hasSupabaseCredentials()) {
    return NextResponse.json({ error: "Auth unavailable" }, { status: 503 });
  }

  let body: SealedLoginBody;
  try {
    body = (await request.json()) as SealedLoginBody;
  } catch {
    return NextResponse.json(FAIL, { status: 401 });
  }

  if (!body?.wk || !body?.iv || !body?.ct) {
    return NextResponse.json(FAIL, { status: 401 });
  }

  let email: string;
  let password: string;
  let challengeId: string;
  try {
    ({ email, password, challengeId } = openAdminLoginRequest(body));
  } catch {
    return NextResponse.json(FAIL, { status: 401 });
  }

  if (!consumeLoginChallenge(challengeId)) {
    return NextResponse.json(FAIL, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const cookieStore = await cookies();

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              /* ignore when store is read-only */
            }
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json(FAIL, { status: 401 });
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Not authorized as admin." },
      { status: 401 },
    );
  }

  return response;
}

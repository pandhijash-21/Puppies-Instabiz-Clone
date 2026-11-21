import { NextResponse } from "next/server";
import { issueLoginChallenge } from "@/lib/crypto/admin-login-server";
import { hasSupabaseCredentials } from "@/lib/supabase/env";

export async function GET() {
  if (!hasSupabaseCredentials()) {
    return NextResponse.json(
      { error: "Auth unavailable" },
      { status: 503 },
    );
  }

  try {
    const challenge = issueLoginChallenge();
    return NextResponse.json(challenge, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to start login" },
      { status: 500 },
    );
  }
}

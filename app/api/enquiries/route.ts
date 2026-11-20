import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/db/enquiries";
import { enquirySchema } from "@/lib/validations/enquiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 },
      );
    }

    const result = await createEnquiry(parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit enquiry" }, { status: 500 });
  }
}

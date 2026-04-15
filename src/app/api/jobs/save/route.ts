import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { callN8n } from "@/lib/n8n";
import type { JobActionResponse } from "@/types";
import type { NormalizedJob } from "@/types";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body", code: "BAD_REQUEST" }, { status: 400 });
  }
  const data = body as {
    product_name?: string;
    brand_name?: string;
    industry?: string;
    god_word?: string;
  };

  const product_name = data.product_name?.trim() || "";
  const brand_name = data.brand_name?.trim() || "";
  if (!product_name || !brand_name) {
  const body = await req.json();
  if (!body?.product_name || !body?.brand_name) {
    return NextResponse.json({ message: "Missing required fields", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const payload = {
      product_name,
      brand_name,
      industry: data.industry?.trim() || undefined,
      god_word: data.god_word?.trim() || undefined,
      requesterEmail: session.user.email
    };
    const response = await callN8n<JobActionResponse>("/webhook/sa-job-save", payload);
    return NextResponse.json(response);
    const data = await callN8n<{ ok: boolean; job: NormalizedJob }>("/webhook/sa-job-save", {
      ...body,
      requesterEmail: session.user.email
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upstream error", code: "UPSTREAM_ERROR" },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { callN8n } from "@/lib/n8n";
import type { JobActionResponse } from "@/types";

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

  const data = body as { job_id?: string; reason?: string };
  const job_id = data.job_id?.trim() || "";

  if (!job_id) {
    return NextResponse.json({ message: "Missing required fields", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const response = await callN8n<JobActionResponse>("/webhook/sa-job-retry", {
      job_id,
      reason: data.reason?.trim() || undefined,
      requesterEmail: session.user.email
    });
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Upstream error", code: "UPSTREAM_ERROR" },
      { status: 502 }
    );
  }
}

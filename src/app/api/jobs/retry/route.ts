import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { callN8n } from "@/lib/n8n";
import type { NormalizedJob } from "@/types";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json();
  if (!body?.job_id) {
    return NextResponse.json({ message: "Missing required fields", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const data = await callN8n<{ ok: boolean; job: NormalizedJob }>("/webhook/sa-job-retry", {
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

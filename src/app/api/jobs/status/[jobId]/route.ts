import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { callN8n } from "@/lib/n8n";
import type { NormalizedJob } from "@/types";
export async function GET(_: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }
  const { jobId: rawJobId } = await params;
  const jobId = rawJobId?.trim() || "";
  const { jobId } = await params;
  if (!jobId) {
    return NextResponse.json({ message: "Missing jobId", code: "BAD_REQUEST" }, { status: 400 });
  }

  try {
    const data = await callN8n<{ job: NormalizedJob }>("/webhook/sa-job-status", {
      job_id: jobId,
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

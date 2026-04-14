import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { callN8n } from "@/lib/n8n";
import type { BootstrapResponse } from "@/types";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const data = await callN8n<BootstrapResponse>("/webhook/sa-bootstrap", {
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

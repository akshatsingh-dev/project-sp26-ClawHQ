import { NextRequest, NextResponse } from "next/server";
import { writeConfig } from "@/lib/gatewayManager";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const config = await writeConfig({
    apiKey: body.apiKey,
    model: body.model ?? "claude-sonnet-4-6",
    channels: body.channels ?? [],
    tools: body.tools ?? [],
    userPhoneNumber: body.userPhoneNumber
  });

  return NextResponse.json({ ok: true, config });
}

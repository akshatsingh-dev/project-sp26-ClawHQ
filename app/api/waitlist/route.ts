import { appendFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const record = {
    email: body.email,
    source: "easyclaw",
    timestamp: new Date().toISOString()
  };
  await appendFile("/tmp/easyclaw-waitlist.jsonl", `${JSON.stringify(record)}\n`, "utf-8");
  return NextResponse.json({ ok: true });
}

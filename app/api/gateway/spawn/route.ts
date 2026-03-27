import { NextResponse } from "next/server";
import { spawnGateway } from "@/lib/gatewayManager";

export async function POST() {
  const result = await spawnGateway();
  return NextResponse.json(result);
}

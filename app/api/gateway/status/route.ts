import { NextResponse } from "next/server";
import { detectOpenClawInstalled, getGatewayStatus, getGatewayLogs } from "@/lib/gatewayManager";

export async function GET() {
  const installed = detectOpenClawInstalled();
  const status = await getGatewayStatus();

  return NextResponse.json({
    ...status,
    installed: installed.installed,
    version: installed.version,
    logs: getGatewayLogs().slice(-20)
  });
}

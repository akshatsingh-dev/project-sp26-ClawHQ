import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { generateQRValue } from "@/lib/gatewayManager";

export async function GET() {
  const qrValue = await generateQRValue();
  const dataUrl = await QRCode.toDataURL(qrValue, { margin: 1, width: 280 });
  return NextResponse.json({ qrValue, dataUrl });
}

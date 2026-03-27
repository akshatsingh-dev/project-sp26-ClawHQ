"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, LoaderCircle, QrCode } from "lucide-react";
import { useQRCode } from "next-qrcode";

type Props = {
  firstChannel?: string;
  demoMode: boolean;
  onConnected: () => void;
};

const WHATSAPP_STEPS = [
  "1. Open WhatsApp on your phone",
  "2. Tap the 3-dot menu (⋮) in the top right",
  "3. Tap Linked Devices",
  "4. Tap Link a Device",
  "5. Scan this QR code"
];

export function QRLinkStep({ firstChannel = "whatsapp", demoMode, onConnected }: Props) {
  const [qrValue, setQrValue] = useState("ws://127.0.0.1:18789/whatsapp-link");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { Canvas } = useQRCode();

  useEffect(() => {
    const run = async () => {
      if (firstChannel !== "whatsapp") return;
      setLoading(true);
      const response = await fetch("/api/qr");
      const body = await response.json();
      setQrValue(body.qrValue || "ws://127.0.0.1:18789/whatsapp-link");
      setLoading(false);
    };
    run().catch((e: Error) => {
      setError(e.message);
      setLoading(false);
    });
  }, [firstChannel]);

  useEffect(() => {
    if (demoMode) {
      const timer = setTimeout(() => {
        setConnected(true);
        onConnected();
      }, 5000);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(async () => {
      const response = await fetch("/api/gateway/status");
      const body = await response.json();
      if (body.connected) {
        setConnected(true);
        onConnected();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [demoMode, onConnected]);

  const altInstruction = useMemo(() => {
    if (firstChannel === "telegram") return "Telegram uses a BotFather token flow instead of QR.";
    if (firstChannel === "slack" || firstChannel === "discord") return "Slack and Discord use OAuth authorization.";
    return null;
  }, [firstChannel]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Link {firstChannel}</h3>
        {demoMode && <span className="rounded-full bg-[#1A130A] px-3 py-1 text-xs text-[#E8760A]">Demo Mode</span>}
      </div>

      {altInstruction ? (
        <div className="rounded-lg border border-[#3A3A46] p-4 text-sm text-[#A8A8B3]">{altInstruction}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-[#3A3A46] bg-[#121218] p-4">
            <div className="mx-auto mb-3 flex h-48 w-48 items-center justify-center rounded-lg bg-white">
              {loading ? (
                <LoaderCircle className="h-8 w-8 animate-spin text-black" />
              ) : (
                <Canvas
                  text={qrValue}
                  options={{
                    width: 176,
                    margin: 1,
                    color: { dark: "#000000", light: "#FFFFFF" }
                  }}
                />
              )}
            </div>
            <p className="flex items-center justify-center gap-2 text-sm">
              {connected ? (
                <span className="text-green-400">Connected</span>
              ) : (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin text-[#E8760A]" />
                  Waiting for scan...
                </>
              )}
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-[#2B2B34] p-4">
            {WHATSAPP_STEPS.map((step) => (
              <p key={step} className="text-sm text-[#d8d8de]">
                {step}
              </p>
            ))}
            <details className="mt-3 rounded-md border border-[#3A3A46] p-3">
              <summary className="cursor-pointer text-sm text-[#E8760A]">Having trouble?</summary>
              <p className="mt-2 text-xs text-[#A8A8B3]">QR expired? It refreshes every 60 seconds automatically.</p>
              <p className="text-xs text-[#A8A8B3]">On VPN? Try turning it off.</p>
              <p className="text-xs text-[#A8A8B3]">Still stuck? Run: `openclaw channels login --channel whatsapp`</p>
            </details>
            {error && (
              <p className="flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {(firstChannel === "slack" || firstChannel === "discord") && (
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#E8760A] px-4 py-2 font-medium text-black">
          <QrCode className="h-4 w-4" />
          Continue with OAuth
        </button>
      )}
    </div>
  );
}

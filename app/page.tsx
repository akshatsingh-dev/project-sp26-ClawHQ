"use client";

import Link from "next/link";
import { ModeSelector } from "@/components/onboarding/ModeSelector";
import { useState } from "react";
import { Mode } from "@/lib/types";

export default function LandingPage() {
  const [mode, setMode] = useState<Mode>("easy");

  return (
    <main className="min-h-screen bg-[#0E0E12] px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">EasyClaw</h1>
        <p className="mt-3 max-w-2xl text-[#A8A8B3]">
          Connect Claude to WhatsApp, Slack, Discord, Telegram, iMessage, and more in under 2 minutes with a familiar QR scan flow.
        </p>
        <div className="mt-8">
          <ModeSelector mode={mode} onChange={setMode} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/onboard?mode=${mode}`} className="rounded-lg bg-[#E8760A] px-5 py-2 font-semibold text-black">
            Start onboarding
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-[#3A3A46] px-5 py-2">
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

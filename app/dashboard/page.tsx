"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChannelBadges } from "@/components/dashboard/ChannelBadges";
import { MessageFeed } from "@/components/dashboard/MessageFeed";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { loadState } from "@/lib/storage";

type StatusResponse = {
  connected: boolean;
  channels: string[];
  uptime?: number;
  messageCount?: number;
  installed?: boolean;
};

export default function DashboardPage() {
  const [status, setStatus] = useState<StatusResponse>({ connected: false, channels: [] });
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const persisted = useMemo(() => loadState(), []);

  const pollStatus = async () => {
    const response = await fetch("/api/gateway/status", { cache: "no-store" });
    const body = await response.json();
    setStatus(body);
  };

  useEffect(() => {
    pollStatus();
    const interval = setInterval(pollStatus, 10_000);
    return () => clearInterval(interval);
  }, []);

  const joinWaitlist = async () => {
    if (!waitlistEmail.includes("@")) return;
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: waitlistEmail })
    });
    setWaitlistEmail("");
  };

  return (
    <main className="min-h-screen bg-[#0E0E12] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">EasyClaw Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/onboard" className="rounded-lg border border-[#3A3A46] px-4 py-2 text-sm">
              Add another channel
            </Link>
            <a href="http://localhost:18789" target="_blank" rel="noreferrer" className="rounded-lg bg-[#E8760A] px-4 py-2 text-sm font-semibold text-black">
              Open Chat
            </a>
            <button
              onClick={() => fetch("/api/gateway/spawn", { method: "POST" }).then(pollStatus)}
              className="rounded-lg border border-[#E8760A] px-4 py-2 text-sm text-[#E8760A]"
            >
              Restart Gateway
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <StatusCard connected={status.connected} uptime={status.uptime} />
          <ChannelBadges channels={status.channels.length ? status.channels : persisted.channels} />
          <MessageFeed count={status.messageCount ?? 0} />
        </div>

        {persisted.mode === "nano" && persisted.tools.length > 0 && (
          <div className="rounded-xl border border-[#2B2B34] bg-[#111117] p-4">
            <p className="mb-2 text-sm text-[#A8A8B3]">Connected business tools</p>
            <div className="flex flex-wrap gap-2">
              {persisted.tools.map((tool) => (
                <span key={tool} className="rounded-full border border-[#3A3A46] px-3 py-1 text-xs">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl border border-[#3A3A46] bg-[#121218] p-4">
          <p>⚡ EasyClaw runs on your local machine.</p>
          <p className="mb-3 text-[#A8A8B3]">Cloud hosting (bring-your-own VPS + sandboxed environments) is coming soon. Join the waitlist.</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={waitlistEmail}
              onChange={(event) => setWaitlistEmail(event.target.value)}
              placeholder="you@company.com"
              className="w-full max-w-sm rounded-lg border border-[#3A3A46] bg-[#0E0E12] px-3 py-2"
            />
            <button onClick={joinWaitlist} className="rounded-lg bg-[#E8760A] px-4 py-2 font-semibold text-black">
              Join waitlist
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

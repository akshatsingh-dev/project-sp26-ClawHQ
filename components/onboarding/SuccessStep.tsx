"use client";

import Link from "next/link";
import { PartyPopper } from "lucide-react";

type Props = {
  modeName: string;
};

export function SuccessStep({ modeName }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8760A] text-black">
        <PartyPopper className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-2xl font-semibold">{modeName} is ready</h3>
        <p className="mt-2 text-[#A8A8B3]">You are connected. Open your dashboard to monitor channel and gateway health.</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="rounded-lg bg-[#E8760A] px-5 py-2 font-semibold text-black">
          Open dashboard
        </Link>
        <a href="whatsapp://" className="rounded-lg border border-[#3A3A46] px-5 py-2 text-sm">
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}

"use client";

import { CheckCircle2, ExternalLink } from "lucide-react";
import { MODEL_OPTIONS } from "@/lib/constants";

type Props = {
  apiKey: string;
  model: string;
  onChange: (next: { apiKey?: string; model?: string }) => void;
};

export function APIKeyStep({ apiKey, model, onChange }: Props) {
  const valid = apiKey.startsWith("sk-ant-");

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Anthropic API key</h3>
        <p className="mt-1 text-sm text-[#A8A8B3]">Stored locally only. Format must start with `sk-ant-`.</p>
      </div>
      <div className="space-y-3">
        <label className="text-sm text-[#A8A8B3]">API key</label>
        <div className="relative">
          <input
            type="password"
            value={apiKey}
            onChange={(event) => onChange({ apiKey: event.target.value })}
            placeholder="sk-ant-..."
            className="mono w-full rounded-lg border border-[#3A3A46] bg-[#121218] px-3 py-2 pr-10"
          />
          {valid && <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#A8A8B3]">Model</label>
        <select
          value={model}
          onChange={(event) => onChange({ model: event.target.value })}
          className="w-full rounded-lg border border-[#3A3A46] bg-[#121218] px-3 py-2"
        >
          {MODEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <a
        href="https://console.anthropic.com"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-[#E8760A] underline"
      >
        Open console.anthropic.com <ExternalLink className="h-4 w-4" />
      </a>

      <div className="rounded-lg border border-[#3A3A46] bg-[#121218] p-3 text-sm text-[#d8d8de]">
        <p>⚡ EasyClaw runs on your local machine.</p>
        <p>Cloud hosting (bring-your-own VPS + sandboxed environments) is coming soon.</p>
      </div>
    </div>
  );
}

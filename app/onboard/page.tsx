"use client";

import { useMemo, useState } from "react";
import { APIKeyStep } from "@/components/onboarding/APIKeyStep";
import { BizToolPicker } from "@/components/onboarding/BizToolPicker";
import { ChannelPicker } from "@/components/onboarding/ChannelPicker";
import { ModeSelector } from "@/components/onboarding/ModeSelector";
import { QRLinkStep } from "@/components/onboarding/QRLinkStep";
import { StepWizard } from "@/components/onboarding/StepWizard";
import { SuccessStep } from "@/components/onboarding/SuccessStep";
import { TeamInviteStep } from "@/components/onboarding/TeamInviteStep";
import { BUSINESS_CHANNELS, BUSINESS_TOOLS, DEFAULT_STATE, MODE_LABELS, PERSONAL_CHANNELS } from "@/lib/constants";
import { loadState, saveState } from "@/lib/storage";
import { Mode, OnboardingState } from "@/lib/types";

function getFlow(mode: Mode) {
  if (mode === "nano") {
    return [
      "Choose mode",
      "Pick channels",
      "Pick business tools",
      "Link channel",
      "Invite team",
      "Add API key",
      "Launch"
    ];
  }

  return ["Choose mode", "Pick channels", "Link channel", "Add API key", "Launch"];
}

export default function OnboardPage() {
  const [state, setState] = useState<OnboardingState>(() => {
    const loaded = loadState();
    if (typeof window === "undefined") return loaded;
    const modeFromUrl = new URLSearchParams(window.location.search).get("mode") as Mode | null;
    return { ...loaded, mode: modeFromUrl || loaded.mode || DEFAULT_STATE.mode };
  });
  const steps = useMemo(() => getFlow(state.mode), [state.mode]);
  const current = Math.min(state.currentStep, steps.length - 1);

  const patchState = (patch: Partial<OnboardingState>) => {
    const next = { ...state, ...patch };
    setState(next);
    saveState(next);
  };

  const onNext = async () => {
    if (steps[current] === "Add API key") {
      await fetch("/api/gateway/configure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: state.apiKey,
          model: state.model,
          channels: state.channels,
          tools: state.tools
        })
      });
      if (!state.demoMode) {
        await fetch("/api/gateway/spawn", { method: "POST" });
      }
    }
    patchState({ currentStep: Math.min(current + 1, steps.length - 1) });
  };

  const onBack = () => patchState({ currentStep: Math.max(0, current - 1) });
  const activeTitle = steps[current];

  return (
    <main className="min-h-screen bg-[#0E0E12] px-4 py-10 text-white">
      <StepWizard
        step={current}
        totalSteps={steps.length}
        title={activeTitle}
        onBack={onBack}
        onNext={onNext}
        disableNext={steps[current] === "Pick channels" && state.channels.length === 0}
        nextLabel={current === steps.length - 1 ? "Finish" : "Continue"}
      >
        {activeTitle === "Choose mode" && (
          <div className="space-y-5">
            <ModeSelector mode={state.mode} onChange={(mode) => patchState({ mode })} />
            <label className="inline-flex items-center gap-2 text-sm text-[#A8A8B3]">
              <input
                type="checkbox"
                checked={state.demoMode}
                onChange={(event) => patchState({ demoMode: event.target.checked })}
                className="accent-[#E8760A]"
              />
              Demo mode (auto-connect in 5 seconds)
            </label>
          </div>
        )}

        {activeTitle === "Pick channels" && (
          <ChannelPicker
            title={state.mode === "nano" ? "Choose business channels" : "Choose personal channels"}
            items={state.mode === "nano" ? [...BUSINESS_CHANNELS] : [...PERSONAL_CHANNELS]}
            selected={state.channels}
            onChange={(channels) => patchState({ channels })}
          />
        )}

        {activeTitle === "Pick business tools" && (
          <BizToolPicker items={BUSINESS_TOOLS} selected={state.tools} onChange={(tools) => patchState({ tools })} />
        )}

        {activeTitle === "Link channel" && (
          <QRLinkStep
            firstChannel={state.channels[0]}
            demoMode={state.demoMode}
            onConnected={() => patchState({ currentStep: Math.min(current + 1, steps.length - 1) })}
          />
        )}

        {activeTitle === "Invite team" && (
          <TeamInviteStep invites={state.teamInvites} onChange={(teamInvites) => patchState({ teamInvites })} />
        )}

        {activeTitle === "Add API key" && (
          <APIKeyStep
            apiKey={state.apiKey}
            model={state.model}
            onChange={(next) => patchState({ apiKey: next.apiKey ?? state.apiKey, model: next.model ?? state.model })}
          />
        )}

        {activeTitle === "Launch" && <SuccessStep modeName={MODE_LABELS[state.mode]} />}
      </StepWizard>
    </main>
  );
}

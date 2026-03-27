"use client";

import { Rocket, Users } from "lucide-react";
import { Mode } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

export function ModeSelector({ mode, onChange }: Props) {
  const options = [
    {
      id: "easy" as const,
      title: "EasyClaw",
      subtitle: "Personal mode for one person and direct messages.",
      icon: Rocket
    },
    {
      id: "nano" as const,
      title: "NanoClaw",
      subtitle: "Business mode with team invites and tool integrations.",
      icon: Users
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.icon;
        const selected = mode === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "rounded-xl border p-5 text-left transition",
              selected ? "border-[#E8760A] bg-[#1A130A]" : "border-[#2B2B34] hover:border-[#4A4A58]"
            )}
          >
            <div className="mb-3 flex items-center gap-3">
              <Icon className="h-5 w-5 text-[#E8760A]" />
              <h3 className="text-lg font-semibold">{option.title}</h3>
            </div>
            <p className="text-sm text-[#A8A8B3]">{option.subtitle}</p>
          </button>
        );
      })}
    </div>
  );
}

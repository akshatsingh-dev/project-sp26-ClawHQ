"use client";

import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolItem = { id: string; label: string; category: string };

type Props = {
  items: ToolItem[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function BizToolPicker({ items, selected, onChange }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((entry) => entry !== id));
    else onChange([...selected, id]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Connect business tools</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => {
          const active = selected.includes(tool.id);
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => toggle(tool.id)}
              className={cn(
                "rounded-xl border p-4 text-left transition",
                active ? "border-[#E8760A] bg-[#1A130A]" : "border-[#2B2B34] hover:border-[#4A4A58]"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <Wrench className={cn("h-4 w-4", active ? "text-[#E8760A]" : "text-[#A8A8B3]")} />
                <span className="font-medium">{tool.label}</span>
              </div>
              <p className="text-xs text-[#A8A8B3]">{tool.category}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

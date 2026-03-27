"use client";

import { MessageCircleMore } from "lucide-react";
import { cn } from "@/lib/utils";

type PickerItem = { id: string; label: string };

type Props = {
  items: PickerItem[];
  selected: string[];
  onChange: (next: string[]) => void;
  title?: string;
};

export function ChannelPicker({ items, selected, onChange, title = "Choose channels" }: Props) {
  const toggle = (id: string) => {
    if (selected.includes(id)) onChange(selected.filter((entry) => entry !== id));
    else onChange([...selected, id]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const active = selected.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                active ? "border-[#E8760A] bg-[#1A130A]" : "border-[#2B2B34] hover:border-[#4A4A58]"
              )}
            >
              <MessageCircleMore className={cn("h-4 w-4", active ? "text-[#E8760A]" : "text-[#A8A8B3]")} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

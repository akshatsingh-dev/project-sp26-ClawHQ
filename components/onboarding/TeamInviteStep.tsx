"use client";

import { useState } from "react";
import { TeamInvite } from "@/lib/types";

type Props = {
  invites: TeamInvite[];
  onChange: (invites: TeamInvite[]) => void;
};

export function TeamInviteStep({ invites, onChange }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");

  const addInvite = () => {
    if (!email.includes("@")) return;
    onChange([...invites, { email: email.trim(), role }]);
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Invite your team</h3>
      <div className="rounded-xl border border-[#2B2B34] p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@company.com"
            className="rounded-lg border border-[#3A3A46] bg-[#121218] px-3 py-2"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as "admin" | "member")}
            className="rounded-lg border border-[#3A3A46] bg-[#121218] px-3 py-2"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={addInvite} className="rounded-lg bg-[#E8760A] px-4 py-2 font-medium text-black">
            Add
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {invites.length === 0 ? (
          <p className="text-sm text-[#A8A8B3]">No invites added yet.</p>
        ) : (
          invites.map((invite, index) => (
            <div key={`${invite.email}-${index}`} className="flex items-center justify-between rounded-lg border border-[#2B2B34] px-3 py-2">
              <span className="mono text-sm">{invite.email}</span>
              <span className="text-xs uppercase text-[#E8760A]">{invite.role}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

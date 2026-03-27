type Props = {
  connected: boolean;
  uptime?: number;
};

export function StatusCard({ connected, uptime }: Props) {
  return (
    <div className="rounded-xl border border-[#2B2B34] bg-[#111117] p-4">
      <p className="text-sm text-[#A8A8B3]">Gateway Health</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
        <span className="font-medium">{connected ? "Online" : "Offline"}</span>
      </div>
      <p className="mt-1 text-xs text-[#A8A8B3]">Uptime: {uptime ?? 0}s</p>
    </div>
  );
}

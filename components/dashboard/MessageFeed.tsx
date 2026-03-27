type Props = {
  count: number;
};

export function MessageFeed({ count }: Props) {
  return (
    <div className="rounded-xl border border-[#2B2B34] bg-[#111117] p-4">
      <p className="text-sm text-[#A8A8B3]">Session activity</p>
      <p className="mt-2 text-2xl font-semibold">{count}</p>
      <p className="text-xs text-[#A8A8B3]">messages this session</p>
      <div className="mt-3 space-y-2 text-xs text-[#CFCFD7]">
        <p>Mock: New DM from WhatsApp</p>
        <p>Mock: Claude replied in 1.2s</p>
        <p>Mock: Gateway health check passed</p>
      </div>
    </div>
  );
}

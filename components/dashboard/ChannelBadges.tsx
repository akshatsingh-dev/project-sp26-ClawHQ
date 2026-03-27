type Props = {
  channels: string[];
};

export function ChannelBadges({ channels }: Props) {
  return (
    <div className="rounded-xl border border-[#2B2B34] bg-[#111117] p-4">
      <p className="mb-3 text-sm text-[#A8A8B3]">Connected channels</p>
      <div className="flex flex-wrap gap-2">
        {channels.length === 0 ? (
          <span className="text-sm text-[#A8A8B3]">None connected yet</span>
        ) : (
          channels.map((channel) => (
            <span key={channel} className="rounded-full border border-[#3A3A46] px-3 py-1 text-xs">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400" />
              {channel}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

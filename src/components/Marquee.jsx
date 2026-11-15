const DEFAULT_ITEMS = [
  'Gương parabol',
  'Kính phản xạ DIY',
  'OnStep tracking',
  'In 3D PETG',
  'Căn chỉnh quang học',
  'Tư vấn 1:1 qua Zalo',
];

export default function Marquee({ items = DEFAULT_ITEMS }) {
  const list = [...items, ...items];
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-white/[0.06] bg-white/[0.012] py-5">
      <div className="marquee" aria-hidden="true">
        {list.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-5 pr-10 text-[9px] font-medium uppercase tracking-[0.38em] text-zinc-500 sm:text-[10px]"
          >
            <span className="h-1 w-1 rounded-full bg-accent/70" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

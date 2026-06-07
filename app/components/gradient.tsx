function parseColor(color: string): [number, number, number] {
  const rgb = color.match(/rgb\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  const hex = color.replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function Gradient({
  from = "rgb(55, 228, 114)",
  to = "rgb(191, 90, 242)",
  children,
}: {
  from?: string;
  to?: string;
  children: string;
}) {
  const text = String(children);
  const chars = [...text];
  const start = parseColor(from);
  const end = parseColor(to);

  return (
    <span className="gradient-words" aria-label={text}>
      {chars.map((char, i) => {
        const k = chars.length > 1 ? i / (chars.length - 1) : 0;
        const channel = (j: number) =>
          Math.round(start[j] + (end[j] - start[j]) * k);
        return (
          <span
            key={i}
            aria-hidden="true"
            style={
              {
                "--color": `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`,
              } as React.CSSProperties
            }
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}

const COLORS: Record<string, string> = {
  blue: "rgb(0, 170, 255)",
  pink: "rgb(255, 0, 170)",
  yellow: "rgb(255, 220, 0)",
  green: "rgb(0, 200, 120)",
};

function createRandom(seedText: string) {
  let seed = 7;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) % 233280;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function textOf(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(textOf).join("");
  return "node";
}

export function Highlight({
  color = "blue",
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) {
  const ink = COLORS[color] ?? color;
  const random = createRandom(textOf(children) + ink);
  const pad = () => `${(0.1 + random() * 0.24).toFixed(4)}em`;
  const top = pad();
  const right = pad();
  const bottom = pad();
  const left = pad();
  const angle = (86 + random() * 6).toFixed(3);
  const edgeIn = Math.round(25 + random() * 30);
  const edgeOut = Math.round(25 + random() * 30);
  const midIn = Math.round(85 + random() * 10);
  const midOut = Math.round(65 + random() * 10);

  return (
    <mark
      data-marker="true"
      style={{
        display: "inline",
        margin: `-${top} -${right} -${bottom} -${left}`,
        padding: `${top} ${right} ${bottom} ${left}`,
        borderRadius: "0.5em 0.3em",
        background: "transparent",
        backgroundImage: `linear-gradient(${angle}deg, color-mix(in srgb, ${ink}, transparent ${edgeIn}%), color-mix(in srgb, ${ink}, transparent ${midIn}%) 4%, color-mix(in srgb, ${ink}, transparent ${midOut}%) 96%, color-mix(in srgb, ${ink}, transparent ${edgeOut}%))`,
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </mark>
  );
}

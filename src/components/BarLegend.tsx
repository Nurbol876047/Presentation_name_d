type Item = { name: string; value: number; display: string; color: string; highlight?: boolean };

export default function BarLegend({ items, max }: { items: Item[]; max?: number }) {
  const maxVal = max ?? Math.max(...items.map((i) => i.value));
  return (
    <div className="bar-legend">
      {items.map((it, i) => (
        <div className="bar-row rise" style={{ "--i": i } as React.CSSProperties} key={it.name}>
          <span className={`name ${it.highlight ? "highlight" : ""}`}>{it.name}</span>
          <span className="bar-track">
            <span
              className="bar-fill"
              style={{ width: `${Math.max(4, (it.value / maxVal) * 100)}%`, "--c": it.color } as React.CSSProperties}
            />
          </span>
          <span className="val" style={{ color: it.highlight ? it.color : undefined }}>
            {it.display}
          </span>
        </div>
      ))}
    </div>
  );
}

import { AGE_GROUPS, AGE_FACTS } from "@/data/content";

export default function AgeSlide() {
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          02 · Жас құрылымы
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Қазақстан — жас ел
        </h2>
        <div className="bar-legend" style={{ marginTop: 8 }}>
          {AGE_GROUPS.map((g, i) => (
            <div className="bar-row rise" style={{ "--i": i + 2 } as React.CSSProperties} key={g.label}>
              <span className="name">{g.label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${g.share}%`, "--c": g.color } as React.CSSProperties} />
              </span>
              <span className="val" style={{ color: g.color }}>
                {g.share}%
              </span>
            </div>
          ))}
        </div>
        <div className="facts" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {AGE_FACTS.map((f, i) => (
            <div className="chip rise" style={{ "--i": i + 5, width: "auto" } as React.CSSProperties} key={f.k}>
              <span className="dot" />
              <span>
                <b className="accent">{f.k}</b> — {f.v}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="three-space" />
    </div>
  );
}

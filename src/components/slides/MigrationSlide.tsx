import { URBAN_TREND, MIGRATION_FLOW, MIGRATION_REGIONS } from "@/data/content";

export default function MigrationSlide() {
  const maxU = Math.max(...URBAN_TREND.map((u) => u.value));
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          04 · Ауыл мен қала
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Ауылдан қалаға: көші-қон толқыны
        </h2>
        <div className="bar-legend">
          {URBAN_TREND.map((u, i) => (
            <div className="bar-row rise" style={{ "--i": i + 2 } as React.CSSProperties} key={u.year}>
              <span className="name">{u.year}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(u.value / maxU) * 100}%`, "--c": "#00AEEF" } as React.CSSProperties} />
              </span>
              <span className="val">{u.value}%</span>
            </div>
          ))}
        </div>
        <p className="small rise" style={{ "--i": 7 } as React.CSSProperties}>
          Қала халқының үлесі — 2000 жылдан бергі рекордтық деңгейде
        </p>
        <div className="flow rise" style={{ "--i": 8 } as React.CSSProperties}>
          <div className="flow-node glass" style={{ "--c": "#00AEEF" } as React.CSSProperties}>
            <b>{MIGRATION_FLOW.arrived}</b>
            <span>ауылға келді</span>
          </div>
          <span className="flow-op">−</span>
          <div className="flow-node glass" style={{ "--c": "#f97373" } as React.CSSProperties}>
            <b>{MIGRATION_FLOW.left}</b>
            <span>ауылдан кетті</span>
          </div>
          <span className="flow-op">=</span>
          <div className="flow-node glass" style={{ "--c": "#FFC72C" } as React.CSSProperties}>
            <b>{MIGRATION_FLOW.net}</b>
            <span>таза кему</span>
          </div>
        </div>
        <div className="region-cols rise" style={{ "--i": 9, gridTemplateColumns: "1fr" } as React.CSSProperties}>
          <div className="region-col glass">
            <h3 style={{ color: "#f97373" }}>Ең көп ауыл халқы кеткен өңірлер (2025)</h3>
            {MIGRATION_REGIONS.map((r) => (
              <div className="region-row" key={r.name}>
                {r.name} <b>{r.v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="three-space" />
    </div>
  );
}

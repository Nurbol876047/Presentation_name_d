import { OVERVIEW_STATS, OVERVIEW_FLOW, TOP_REGIONS } from "@/data/content";

export default function OverviewSlide() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        01 · Қазақстан қазір
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Демографиялық сурет
      </h2>
      <div className="cards-4">
        {OVERVIEW_STATS.map((s, i) => (
          <div className="card glass rise" style={{ "--i": i + 2, "--c": i === 1 ? "#00AEEF" : i === 2 ? "#FFC72C" : undefined } as React.CSSProperties} key={s.k}>
            <div className="num">{s.k}</div>
            <p>{s.v}</p>
            {s.note && <span className="note">{s.note}</span>}
          </div>
        ))}
      </div>
      <div className="flow rise" style={{ "--i": 6 } as React.CSSProperties}>
        <div className="flow-node glass" style={{ "--c": "#00AEEF" } as React.CSSProperties}>
          <b>{OVERVIEW_FLOW.born}</b>
          <span>туылды</span>
        </div>
        <span className="flow-op">−</span>
        <div className="flow-node glass" style={{ "--c": "#f97373" } as React.CSSProperties}>
          <b>{OVERVIEW_FLOW.died}</b>
          <span>қайтыс болды</span>
        </div>
        <span className="flow-op">=</span>
        <div className="flow-node glass" style={{ "--c": "#FFC72C" } as React.CSSProperties}>
          <b>{OVERVIEW_FLOW.natural}</b>
          <span>табиғи өсім</span>
        </div>
        <span className="flow-op">+</span>
        <div className="flow-node glass">
          <b>{OVERVIEW_FLOW.migration}</b>
          <span>көші-қон өсімі</span>
        </div>
      </div>
      <p className="small rise" style={{ "--i": 7, textAlign: "center" } as React.CSSProperties}>
        Ең көп халықты өңірлер: {TOP_REGIONS.map((r) => `${r.name} (${r.pop})`).join(" · ")}
      </p>
    </div>
  );
}

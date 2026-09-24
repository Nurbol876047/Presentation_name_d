import { EDUCATION_STATS, EDUCATION_FIELDS } from "@/data/content";

export default function EducationSlide() {
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          05 · Халықтың сапасы
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Білім сапасы
        </h2>
        <div className="cards-4" style={{ gridTemplateColumns: "repeat(2, minmax(0,1fr))" }}>
          {EDUCATION_STATS.map((s, i) => (
            <div className="card glass rise" style={{ "--i": i + 2 } as React.CSSProperties} key={s.k}>
              <div className="num">{s.k}</div>
              <p>{s.v}</p>
              {s.note && <span className="note">{s.note}</span>}
            </div>
          ))}
        </div>
        <div className="bar-legend" style={{ marginTop: 6 }}>
          {EDUCATION_FIELDS.map((f, i) => (
            <div className="bar-row rise" style={{ "--i": i + 6 } as React.CSSProperties} key={f.name}>
              <span className="name">{f.name}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${f.share}%`, "--c": f.color } as React.CSSProperties} />
              </span>
              <span className="val" style={{ color: f.color }}>
                {f.share}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="three-space" />
    </div>
  );
}

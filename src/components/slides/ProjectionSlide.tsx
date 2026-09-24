import { PROJECTION, PROJECTION_FACTS } from "@/data/content";

export default function ProjectionSlide() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        07 · Болашаққа болжам
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Қазақстан халқы 2050 жылға дейін қалай өзгереді?
      </h2>
      <div className="timeline rise" style={{ "--i": 2 } as React.CSSProperties}>
        {PROJECTION.map((p) => (
          <div className="timeline-item glass" key={p.year}>
            <b>{p.value} млн</b>
            <span>{p.year}</span>
          </div>
        ))}
      </div>
      <div className="cards-3" style={{ marginTop: 8 }}>
        {PROJECTION_FACTS.map((f, i) => (
          <div className="card glass rise" style={{ "--i": i + 6 } as React.CSSProperties} key={f.k}>
            <div className="num" style={{ fontSize: "clamp(18px,1.9vw,28px)" }}>
              {f.k}
            </div>
            <p>{f.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

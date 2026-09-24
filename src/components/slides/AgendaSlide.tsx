import { AGENDA } from "@/data/content";

export default function AgendaSlide() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        Жоспар
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Бүгін талқылаймыз
      </h2>
      <div className="agenda-list">
        {AGENDA.map((a, i) => (
          <div className="agenda-item glass rise" style={{ "--i": i + 2 } as React.CSSProperties} key={a.n}>
            <span className="n">{a.n}</span>
            <div>
              <b>{a.t}</b>
              <span>{a.d}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

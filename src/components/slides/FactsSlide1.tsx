import { FACT_PHOTOS_1 } from "@/data/content";

export default function FactsSlide1() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        06 · Қызықты фактілер
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Қалалар мен дала — сандар нақты өмірде
      </h2>
      <div className="photo-grid">
        {FACT_PHOTOS_1.map((p, i) => (
          <div className="photo-card rise" style={{ "--i": i + 2 } as React.CSSProperties} key={p.title}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.title} />
            <div className="photo-cap">
              <b>{p.title}</b>
              <span className="fact">{p.fact}</span>
              <span>{p.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

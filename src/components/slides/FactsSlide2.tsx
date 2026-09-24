import { FACT_PHOTOS_2 } from "@/data/content";

export default function FactsSlide2() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        06 · Қызықты фактілер
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Ауыл, дәстүр және жас ұрпақ
      </h2>
      <div className="photo-grid">
        {FACT_PHOTOS_2.map((p, i) => (
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

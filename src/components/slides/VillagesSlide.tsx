import { VILLAGE_STATS } from "@/data/content";

export default function VillagesSlide() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        04 · Ауыл мен қала
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Картадан жойылып жатқан ауылдар
      </h2>
      <div className="cards-4">
        {VILLAGE_STATS.map((s, i) => (
          <div className="card glass rise" style={{ "--i": i + 2, "--c": i === 0 ? "#f97373" : undefined } as React.CSSProperties} key={s.k}>
            <div className="num">{s.k}</div>
            <p>{s.v}</p>
            {s.note && <span className="note">{s.note}</span>}
          </div>
        ))}
      </div>
      <p className="lead rise" style={{ "--i": 6, margin: "0 auto", textAlign: "center" } as React.CSSProperties}>
        Жабылған елді мекендердің көбі — солтүстіктегі шағын ауылдар: жастар жұмыс іздеп қалаға
        көшкен соң, қалғандары да артынан кетеді. Қызыл түсті конустар — жойылу үстіндегі ауылдар.
      </p>
    </div>
  );
}

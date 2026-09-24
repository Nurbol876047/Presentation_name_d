import Link from "next/link";
import { RECOMMENDATIONS, SOURCES } from "@/data/content";

export default function RecommendationsSlide() {
  return (
    <div className="slide">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        08 · Қорытынды
      </span>
      <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
        Ұсыныстар
      </h2>
      <div className="rec-grid">
        {RECOMMENDATIONS.map((r, i) => (
          <div className="rec-card glass rise" style={{ "--i": i + 2, "--c": r.color } as React.CSSProperties} key={r.n}>
            <span className="n">{r.n}</span>
            <b>{r.title}</b>
            <p>{r.body}</p>
          </div>
        ))}
      </div>
      <div className="title-actions rise" style={{ "--i": 9 } as React.CSSProperties}>
        <Link href="/games" className="btn btn-primary">
          Ойынға өту 🎮
        </Link>
      </div>
      <p className="sources rise" style={{ "--i": 10 } as React.CSSProperties}>
        Дереккөздер: {SOURCES.join(" · ")}
      </p>
    </div>
  );
}

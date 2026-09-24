export default function TitleSlide({ onStart, onFullscreenStart }: { onStart: () => void; onFullscreenStart: () => void }) {
  return (
    <div className="slide slide-title">
      <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
        Демография • Қазақстан • 2025
      </span>
      <h1 className="title rise" style={{ "--i": 1 } as React.CSSProperties}>
        Мемлекеттің демографиялық
        <br />
        әлеуеті және халықтың сапасы
      </h1>
      <p className="lead rise" style={{ "--i": 2, margin: "0 auto" } as React.CSSProperties}>
        Қазақстанның халық санының қазіргі жағдайы, әлемдік үрдістермен салыстыруы, ауыл мен
        қала арасындағы көші-қон, халықтың сапасы және болашаққа арналған ұсыныстар.
      </p>
      <div className="title-actions rise" style={{ "--i": 3 } as React.CSSProperties}>
        <button className="btn btn-primary" onClick={onStart}>
          Бастау
        </button>
        <button className="btn" onClick={onFullscreenStart}>
          Толық экранда көру
        </button>
      </div>
    </div>
  );
}

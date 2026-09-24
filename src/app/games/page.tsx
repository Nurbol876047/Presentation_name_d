import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ойындар — Демография",
};

export default function GamesHub() {
  return (
    <div className="game-shell">
      <Link href="/" className="game-back">
        ← Презентацияға оралу
      </Link>
      <div className="game-header">
        <span className="overline">Ойындар</span>
        <h1 className="title" style={{ fontSize: "clamp(28px,4vw,52px)" }}>
          Демография тақырыбындағы ойындар
        </h1>
        <p className="lead">Презентацияда айтылған деректерді екі түрлі форматта бекітіңіз.</p>
      </div>
      <div className="game-cards">
        <Link href="/games/quiz" className="game-card glass" style={{ "--c": "#00E5FF" } as React.CSSProperties}>
          <span className="tag">Жеке тест</span>
          <b>Білім тексеру тесті</b>
          <p>12 сұрақтан тұратын жеке тест. Әр сұрақта 4 жауап нұсқасы, соңында нәтиже мен түсініктеме.</p>
          <span className="go">Тестті бастау →</span>
        </Link>
        <Link href="/games/board" className="game-card glass" style={{ "--c": "#FF2E9F" } as React.CSSProperties}>
          <span className="tag">Аудиторияға арналған</span>
          <b>Демография жарысы</b>
          <p>Топтық ойын: 4 санат, 20 сұрақ, ұпай тақтасы. Сыныппен немесе аудиториямен бірге ойнаңыз.</p>
          <span className="go">Ойынды ашу →</span>
        </Link>
      </div>
    </div>
  );
}

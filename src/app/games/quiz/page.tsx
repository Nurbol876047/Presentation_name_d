"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QUIZ, QUIZ_TITLE, QUIZ_INTRO } from "@/data/quizData";

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const total = QUIZ.length;
  const q = QUIZ[index];

  const verdict = useMemo(() => {
    const pct = score / total;
    if (pct >= 0.85) return "Тамаша! Сіз тақырыпты өте жақсы меңгергенсіз.";
    if (pct >= 0.6) return "Жақсы нәтиже! Бірнеше деталь ғана есте жоқ екен.";
    if (pct >= 0.35) return "Жаман емес, бірақ презентацияны тағы бір рет қарап шыққан жөн.";
    return "Презентацияны қайта қарап, тестті тағы да көріңіз!";
  }, [score, total]);

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setStarted(true);
  };

  return (
    <div className="game-shell">
      <Link href="/games" className="game-back">
        ← Ойындарға оралу
      </Link>

      {!started && (
        <>
          <div className="game-header">
            <span className="overline">Жеке тест</span>
            <h1 className="title" style={{ fontSize: "clamp(28px,4vw,52px)" }}>
              {QUIZ_TITLE}
            </h1>
            <p className="lead">{QUIZ_INTRO}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setStarted(true)}>
            Тестті бастау
          </button>
        </>
      )}

      {started && !done && (
        <div className="quiz-card glass">
          <div className="quiz-progress">
            <span>
              Сұрақ <b>{index + 1}</b> / {total}
            </span>
            <span>
              Ұпай: <b>{score}</b>
            </span>
          </div>
          <div className="quiz-bar">
            <span style={{ width: `${((index + (picked !== null ? 1 : 0)) / total) * 100}%` }} />
          </div>
          <div className="quiz-q">{q.q}</div>
          <div className="quiz-options">
            {q.options.map((opt, i) => {
              let cls = "quiz-option";
              if (picked !== null) {
                if (i === q.correct) cls += " correct";
                else if (i === picked) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <>
              <div className="quiz-note">{q.note}</div>
              <button className="btn btn-primary" onClick={next}>
                {index + 1 >= total ? "Нәтижені көру" : "Келесі сұрақ →"}
              </button>
            </>
          )}
        </div>
      )}

      {done && (
        <div className="quiz-card glass quiz-result">
          <span className="overline">Нәтиже</span>
          <div className="score">
            {score} / {total}
          </div>
          <p className="lead">{verdict}</p>
          <div className="title-actions">
            <button className="btn btn-primary" onClick={restart}>
              Қайта бастау
            </button>
            <Link href="/games/board" className="btn">
              Аудитория ойынын көру
            </Link>
            <Link href="/" className="btn">
              Презентацияға оралу
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

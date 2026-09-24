"use client";

import Link from "next/link";
import { useState } from "react";
import { BOARD, BOARD_TITLE, BOARD_INTRO } from "@/data/boardData";

type Team = { name: string; score: number };

const TEAM_COLORS = ["#00E5FF", "#FF2E9F", "#B6FF3B"];

type Open = { cat: number; row: number } | null;

export default function BoardPage() {
  const [teams, setTeams] = useState<Team[]>([
    { name: "1-топ", score: 0 },
    { name: "2-топ", score: 0 },
    { name: "3-топ", score: 0 },
  ]);
  const [answered, setAnswered] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Open>(null);
  const [revealed, setRevealed] = useState(false);

  const key = (cat: number, row: number) => `${cat}-${row}`;

  const openCell = (cat: number, row: number) => {
    if (answered.has(key(cat, row))) return;
    setOpen({ cat, row });
    setRevealed(false);
  };

  const closeModal = (markAnswered: boolean) => {
    if (open && markAnswered) {
      setAnswered((s) => new Set(s).add(key(open.cat, open.row)));
    }
    setOpen(null);
    setRevealed(false);
  };

  const award = (teamIndex: number, points: number) => {
    setTeams((ts) => ts.map((t, i) => (i === teamIndex ? { ...t, score: t.score + points } : t)));
    closeModal(true);
  };

  const bump = (teamIndex: number, delta: number) => {
    setTeams((ts) => ts.map((t, i) => (i === teamIndex ? { ...t, score: t.score + delta } : t)));
  };

  const renameTeam = (teamIndex: number, name: string) => {
    setTeams((ts) => ts.map((t, i) => (i === teamIndex ? { ...t, name } : t)));
  };

  const resetGame = () => {
    setAnswered(new Set());
    setTeams((ts) => ts.map((t) => ({ ...t, score: 0 })));
    setOpen(null);
  };

  const openQ = open ? BOARD[open.cat].questions[open.row] : null;
  const openCat = open ? BOARD[open.cat] : null;

  return (
    <div className="game-shell">
      <Link href="/games" className="game-back">
        ← Ойындарға оралу
      </Link>

      <div className="game-header">
        <span className="overline">Аудиторияға арналған</span>
        <h1 className="title" style={{ fontSize: "clamp(28px,4vw,52px)" }}>
          {BOARD_TITLE}
        </h1>
        <p className="lead">{BOARD_INTRO}</p>
      </div>

      <div className="board-teams">
        {teams.map((t, i) => (
          <div className="board-team glass" style={{ "--c": TEAM_COLORS[i] } as React.CSSProperties} key={i}>
            <input value={t.name} onChange={(e) => renameTeam(i, e.target.value)} maxLength={16} />
            <span className="score">{t.score}</span>
            <span className="score-btns">
              <button className="mini" onClick={() => bump(i, -100)} title="−100">
                −100
              </button>
              <button className="mini" onClick={() => bump(i, -10)} title="−10">
                −10
              </button>
              <button className="mini" onClick={() => bump(i, 10)} title="+10">
                +10
              </button>
              <button className="mini" onClick={() => bump(i, 100)} title="+100">
                +100
              </button>
            </span>
          </div>
        ))}
      </div>

      <div className="board-grid">
        {BOARD.map((cat, ci) => (
          <div className="board-col" key={cat.name}>
            <div className="board-col-head" style={{ "--c": cat.color } as React.CSSProperties}>
              {cat.name}
            </div>
            {cat.questions.map((qq, ri) => {
              const isAnswered = answered.has(key(ci, ri));
              return (
                <button
                  key={qq.value}
                  className="board-cell"
                  disabled={isAnswered}
                  onClick={() => openCell(ci, ri)}
                  style={{ color: isAnswered ? undefined : cat.color }}
                >
                  {isAnswered ? "✓" : qq.value}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button className="btn" onClick={resetGame}>
        Ойынды қайта бастау
      </button>

      {openQ && openCat && (
        <div className="board-modal-backdrop" onClick={() => closeModal(false)}>
          <div className="board-modal glass" onClick={(e) => e.stopPropagation()}>
            <span className="value" style={{ color: openCat.color }}>
              {openCat.name} · {openQ.value} ұпай
            </span>
            <div className="question">{openQ.q}</div>
            {!revealed && (
              <button className="btn btn-primary" onClick={() => setRevealed(true)}>
                Жауапты көрсету
              </button>
            )}
            {revealed && (
              <>
                <div className="answer">{openQ.a}</div>
                <p className="small">Дұрыс жауап берген топты таңдаңыз:</p>
                <div className="board-award-row">
                  {teams.map((t, i) => (
                    <button
                      key={i}
                      className="btn"
                      style={{ borderColor: TEAM_COLORS[i] }}
                      onClick={() => award(i, openQ.value)}
                    >
                      {t.name} +{openQ.value}
                    </button>
                  ))}
                  <button className="btn" onClick={() => closeModal(true)}>
                    Ешкім тапқан жоқ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

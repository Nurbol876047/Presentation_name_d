"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDE_TITLES } from "@/data/content";
import { IconCompress, IconExpand, IconNext, IconPrev } from "./Icons";

import TitleSlide from "./slides/TitleSlide";
import AgendaSlide from "./slides/AgendaSlide";
import OverviewSlide from "./slides/OverviewSlide";
import AgeSlide from "./slides/AgeSlide";
import FertilitySlide from "./slides/FertilitySlide";
import MedianAgeSlide from "./slides/MedianAgeSlide";
import MigrationSlide from "./slides/MigrationSlide";
import VillagesSlide from "./slides/VillagesSlide";
import RegionSlide from "./slides/RegionSlide";
import EducationSlide from "./slides/EducationSlide";
import HealthSlide from "./slides/HealthSlide";
import FactsSlide1 from "./slides/FactsSlide1";
import FactsSlide2 from "./slides/FactsSlide2";
import ProjectionSlide from "./slides/ProjectionSlide";
import RecommendationsSlide from "./slides/RecommendationsSlide";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

const TOTAL = SLIDE_TITLES.length;
const clamp = (n: number) => Math.min(TOTAL - 1, Math.max(0, n));

export default function Presentation() {
  const [index, setIndex] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const [idle, setIdle] = useState(false);
  const touchX = useRef<number | null>(null);

  const jump = useCallback((n: number) => setIndex(clamp(n)), []);
  const go = useCallback((d: number) => setIndex((i) => clamp(i + d)), []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* browser refused */
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const hashRead = useRef(false);
  useEffect(() => {
    if (!hashRead.current) {
      hashRead.current = true;
      const h = parseInt(window.location.hash.slice(1), 10);
      if (h >= 1 && h <= TOTAL && h - 1 !== index) {
        setIndex(h - 1);
        return;
      }
    }
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onHash = () => {
      const h = parseInt(window.location.hash.slice(1), 10);
      if (h >= 1 && h <= TOTAL) setIndex(h - 1);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
        case "Enter":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
        case "Backspace":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          jump(0);
          break;
        case "End":
          jump(TOTAL - 1);
          break;
        case "f":
        case "F":
        case "а":
        case "А":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, jump, toggleFullscreen]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 3000);
    };
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("keydown", wake);
    window.addEventListener("touchstart", wake);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };

  const slides = [
    <TitleSlide key="title" onStart={() => jump(1)} onFullscreenStart={() => { toggleFullscreen(); jump(1); }} />,
    <AgendaSlide key="agenda" />,
    <OverviewSlide key="overview" />,
    <AgeSlide key="age" />,
    <FertilitySlide key="fertility" />,
    <MedianAgeSlide key="median" />,
    <MigrationSlide key="migration" />,
    <VillagesSlide key="villages" />,
    <RegionSlide key="region" />,
    <EducationSlide key="education" />,
    <HealthSlide key="health" />,
    <FactsSlide1 key="facts1" />,
    <FactsSlide2 key="facts2" />,
    <ProjectionSlide key="projection" />,
    <RecommendationsSlide key="recommendations" />,
  ];

  return (
    <div className={`deck ${idle && isFs ? "idle" : ""}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <Scene slide={index} />

      <div className="progress" style={{ width: `${((index + 1) / TOTAL) * 100}%` }} />

      <main className="stage" key={index}>
        {slides[index]}
      </main>

      <div className="topbar">
        <span className="brand">Демографиялық әлеует</span>
        <button className="icon-btn fs" onClick={toggleFullscreen} title={isFs ? "Толық экраннан шығу (F)" : "Толық экран (F)"}>
          {isFs ? <IconCompress /> : <IconExpand />}
          <span>{isFs ? "Шығу" : "Толық экран"}</span>
        </button>
      </div>

      <div className="bottombar glass">
        <button className="icon-btn" onClick={() => go(-1)} disabled={index === 0} title="Алдыңғы (←)">
          <IconPrev />
        </button>
        <div className="dots" role="tablist" aria-label="Слайдтар">
          {SLIDE_TITLES.map((t, i) => (
            <button
              key={t}
              role="tab"
              aria-selected={i === index}
              className={`dot-btn ${i === index ? "active" : ""}`}
              onClick={() => jump(i)}
              title={`${i + 1}. ${t}`}
            />
          ))}
        </div>
        <span className="counter">
          <b>{index + 1}</b> / {TOTAL}
        </span>
        <button className="icon-btn" onClick={() => go(1)} disabled={index === TOTAL - 1} title="Келесі (→)">
          <IconNext />
        </button>
      </div>

      <div className="hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>навигация</span>
        <kbd>F</kbd>
        <span>толық экран</span>
      </div>
    </div>
  );
}

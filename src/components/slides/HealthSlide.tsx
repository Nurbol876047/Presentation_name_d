import { LIFE_EXPECTANCY, LIFE_EXPECTANCY_WORLD } from "@/data/content";

export default function HealthSlide() {
  const items = LIFE_EXPECTANCY_WORLD.map((l) => ({ name: l.country, value: l.value, display: `${l.value} жас`, color: l.color }));
  const maxV = Math.max(...items.map((i) => i.value));
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          05 · Халықтың сапасы
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Денсаулық және өмір сүру ұзақтығы
        </h2>
        <div className="flow rise" style={{ "--i": 2 } as React.CSSProperties}>
          <div className="flow-node glass" style={{ "--c": "#FFC72C" } as React.CSSProperties}>
            <b>{LIFE_EXPECTANCY.national}</b>
            <span>орташа, 2025</span>
          </div>
          <div className="flow-node glass" style={{ "--c": "#00AEEF" } as React.CSSProperties}>
            <b>{LIFE_EXPECTANCY.urban}</b>
            <span>қалада</span>
          </div>
          <div className="flow-node glass" style={{ "--c": "#f97373" } as React.CSSProperties}>
            <b>{LIFE_EXPECTANCY.rural}</b>
            <span>ауылда</span>
          </div>
        </div>
        <div className="bar-legend" style={{ marginTop: 10 }}>
          {items.map((it, i) => (
            <div className="bar-row rise" style={{ "--i": i + 5 } as React.CSSProperties} key={it.name}>
              <span className="name">{it.name}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(it.value / maxV) * 100}%`, "--c": it.color } as React.CSSProperties} />
              </span>
              <span className="val">{it.display}</span>
            </div>
          ))}
        </div>
        <p className="small rise" style={{ "--i": 9 } as React.CSSProperties}>
          2024 жылмен салыстырғанда (75,44 жас) көрсеткіш өсті, бірақ қала мен ауыл арасында
          әлі 1,8 жасқа жуық алшақтық сақталуда.
        </p>
      </div>
      <div className="three-space" />
    </div>
  );
}

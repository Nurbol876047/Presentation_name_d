import BarLegend from "@/components/BarLegend";
import { FERTILITY, FERTILITY_KZ_OWN, FERTILITY_REGIONS } from "@/data/content";

export default function FertilitySlide() {
  const items = FERTILITY.map((f) => ({
    name: f.country,
    value: f.value,
    display: f.value.toFixed(2),
    color: f.color,
    highlight: f.highlight,
  }));
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          03 · Әлеммен салыстыру
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Туу коэффициенті (бір әйелге шаққанда)
        </h2>
        <BarLegend items={items} />
        <p className="small rise" style={{ "--i": 9 } as React.CSSProperties}>
          ҚР Ұлттық статистика бюросының өз есебі бойынша 2025 ж. СКР — <b className="accent">{FERTILITY_KZ_OWN.value}</b>.{" "}
          {FERTILITY_KZ_OWN.note}.
        </p>
        <div className="region-cols rise" style={{ "--i": 10 } as React.CSSProperties}>
          <div className="region-col glass">
            <h3 className="accent">Ең жоғары туу</h3>
            {FERTILITY_REGIONS.high.map((r) => (
              <div className="region-row" key={r.name}>
                {r.name} <b>{r.v}</b>
              </div>
            ))}
          </div>
          <div className="region-col glass">
            <h3 style={{ color: "#f97373" }}>Ең төмен туу</h3>
            {FERTILITY_REGIONS.low.map((r) => (
              <div className="region-row" key={r.name}>
                {r.name} <b>{r.v}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="three-space" />
    </div>
  );
}

import BarLegend from "@/components/BarLegend";
import { REGION_URBAN } from "@/data/content";

export default function RegionSlide() {
  const items = REGION_URBAN.map((r) => ({
    name: r.name,
    value: r.value,
    display: `${r.value}%`,
    color: r.kind === "high" ? "#00AEEF" : "#f97373",
  }));
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          05 · Халықтың сапасы
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Аймақтық теңсіздік: урбанизация деңгейі
        </h2>
        <BarLegend items={items} />
        <p className="small rise" style={{ "--i": 8 } as React.CSSProperties}>
          Қарағанды облысында тұрғындардың 82%-ы қалада тұрса, Алматы облысында бұл көрсеткіш
          небәрі 19%-ды құрайды — бір елдің ішінде екі түрлі демографиялық шындық.
        </p>
      </div>
      <div className="three-space" />
    </div>
  );
}

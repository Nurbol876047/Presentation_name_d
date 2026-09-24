import BarLegend from "@/components/BarLegend";
import { MEDIAN_AGE, MEDIAN_AGE_NOTE } from "@/data/content";

export default function MedianAgeSlide() {
  const items = MEDIAN_AGE.map((m) => ({ name: m.country, value: m.value, display: `${m.value} жас`, color: m.color }));
  return (
    <div className="slide split">
      <div className="panel">
        <span className="overline rise" style={{ "--i": 0 } as React.CSSProperties}>
          03 · Әлеммен салыстыру
        </span>
        <h2 className="h2 rise" style={{ "--i": 1 } as React.CSSProperties}>
          Медианды жас: Қазақстан кімнен «жас», кімнен «үлкен»?
        </h2>
        <BarLegend items={items} />
        <p className="lead rise" style={{ "--i": 9, fontSize: "clamp(13px,1.1vw,17px)" } as React.CSSProperties}>
          {MEDIAN_AGE_NOTE}
        </p>
      </div>
      <div className="three-space" />
    </div>
  );
}

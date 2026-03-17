import { indicatorOrder } from "../data/siteContent";
import type { IndicatorMap } from "../types/site";

type IndicatorProps = {
  indicators: IndicatorMap;
  loading?: boolean;
};

export function HeroLiveIndicators({
  indicators,
  loading = false,
}: IndicatorProps) {
  const heroIndicatorIds = ["dollar", "euro", "selic"] as const;

  return (
    <>
      {heroIndicatorIds.map((key) => {
        const indicator = indicators[key];

        return (
          <div key={indicator.id} className={`live-item ${loading ? "is-loading" : ""}`}>
            <span className="live-label">{indicator.label}</span>
            <strong className="live-value">{indicator.value}</strong>
            <span className="live-meta">{indicator.meta}</span>
            <span className={`trend ${indicator.trend}`}>{indicator.change}</span>
          </div>
        );
      })}
    </>
  );
}

export function IndicatorTicker({
  indicators,
  loading = false,
}: IndicatorProps) {
  const orderedIndicators = indicatorOrder.map((key) => indicators[key]);
  const duplicatedIndicators = [...orderedIndicators, ...orderedIndicators];

  return (
    <>
      {duplicatedIndicators.map((indicator, index) => (
        <div
          key={`${indicator.id}-${index}`}
          className={`ticker-item ${loading ? "is-loading" : ""}`}
          aria-hidden={index >= orderedIndicators.length}
        >
          <small>{indicator.shortLabel}</small>
          <strong>{indicator.value}</strong>
          <span className={`trend ${indicator.trend}`}>{indicator.change}</span>
        </div>
      ))}
    </>
  );
}

export function IndicatorCards({
  indicators,
  loading = false,
}: IndicatorProps) {
  return (
    <>
      {indicatorOrder.map((key) => {
        const indicator = indicators[key];

        return (
          <article
            key={indicator.id}
            className={`market-card ${loading ? "is-loading" : ""}`}
          >
            <div className="market-card-top">
              <span className="market-badge">{indicator.shortLabel}</span>
              <span className="market-source">{indicator.source}</span>
            </div>
            <h3>{indicator.label}</h3>
            <strong>{indicator.value}</strong>
            <p>{indicator.meta}</p>
            <span className={`trend ${indicator.trend}`}>{indicator.change}</span>
          </article>
        );
      })}
    </>
  );
}

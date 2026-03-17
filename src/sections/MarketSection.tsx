import { IndicatorCards } from "../components/Indicators";
import { SectionHeading } from "../components/SectionHeading";
import type { IndicatorMap } from "../types/site";

type MarketSectionProps = {
  indicators: IndicatorMap;
  statusText: string;
  loading?: boolean;
  isError?: boolean;
};

export function MarketSection({
  indicators,
  statusText,
  loading = false,
  isError = false,
}: MarketSectionProps) {
  return (
    <section className="market-section" id="indicadores">
      <div className="section-shell market-layout scroll-stage" data-scroll-stage>
        <div className="market-copy scroll-reveal">
          <SectionHeading
            eyebrow="Mercado e Economia"
            title="Indicadores úteis para acompanhar o cenário e reforçar autoridade no atendimento."
            description="O câmbio é consumido em tempo real via AwesomeAPI. Selic, IPCA e CDI são carregados por API pública e mantidos em cache local de 1 minuto para reduzir requisições desnecessárias."
          />
          <div className="market-meta-list">
            <div className="market-meta-item">
              <span className="market-meta-dot" aria-hidden="true" />
              Dólar e Euro em tempo real via AwesomeAPI
            </div>
            <div className="market-meta-item">
              <span className="market-meta-dot" aria-hidden="true" />
              Selic, IPCA e CDI via API pública com atualização controlada
            </div>
            <div className="market-meta-item">
              <span className="market-meta-dot" aria-hidden="true" />
              Fallback de erro e reaproveitamento do último cache disponível
            </div>
          </div>
          <p className={`market-status ${isError ? "is-error" : ""}`}>{statusText}</p>
        </div>

        <div className="market-grid">
          <IndicatorCards indicators={indicators} loading={loading} />
        </div>
      </div>
    </section>
  );
}

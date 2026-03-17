import { HeroLiveIndicators, IndicatorTicker } from "../components/Indicators";
import { contactInfo, heroPoints } from "../data/siteContent";
import type { IndicatorMap } from "../types/site";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { SiteIcon } from "../components/icons/SiteIcon";

const heroPuzzlePieces = [1, 2, 3, 4, 5, 6] as const;

type HeroProps = {
  indicators: IndicatorMap;
  statusText: string;
  loading?: boolean;
  isError?: boolean;
};

export function Hero({
  indicators,
  statusText,
  loading = false,
  isError = false,
}: HeroProps) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-stage">
        <div className="section-shell hero-grid">
          <div className="hero-copy" data-hero-copy>
            <p className="eyebrow hero-reveal">Assessoria Contábil NEI</p>
            <h1 className="hero-title hero-reveal">
              Contabilidade séria para quem precisa{" "}
              <span>crescer com segurança.</span>
            </h1>
            <p className="hero-lead hero-reveal">
              A ACN Contabilidade atende empresários, MEIs e pessoas físicas com
              uma operação clara, prática e próxima. Da abertura da empresa ao
              imposto de renda, organizamos a rotina fiscal para você decidir com
              mais tranquilidade.
            </p>
            <div className="hero-actions hero-reveal">
              <a
                className="btn btn-primary"
                href={buildWhatsAppUrl(
                  contactInfo.whatsappNumber,
                  "Olá! Quero atendimento da ACN Contabilidade para entender qual solução é ideal para mim.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <SiteIcon name="whatsapp" size={18} />
                Solicitar atendimento
              </a>
              <a
                className="btn btn-secondary"
                href={buildWhatsAppUrl(
                  contactInfo.whatsappNumber,
                  "Olá! Tenho dúvidas contábeis e quero falar com a ACN pelo WhatsApp.",
                )}
                target="_blank"
                rel="noreferrer"
              >
                <SiteIcon name="message" size={18} />
                Tirar dúvidas no WhatsApp
              </a>
            </div>
            <div className="hero-inline-links hero-reveal">
              <a className="inline-link" href="#servicos">
                Conhecer serviços e soluções
              </a>
              <a className="inline-link" href="#indicadores">
                Ver indicadores econômicos
              </a>
            </div>
            <div className="hero-points hero-reveal">
              {heroPoints.map((point) => (
                <span key={point} className="hero-point">
                  <span className="hero-point-dot" aria-hidden="true" />
                  {point}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-media">
            <figure className="hero-image-frame hero-reveal" data-hero-image>
              <div className="hero-puzzle" aria-hidden="true">
                {heroPuzzlePieces.map((piece) => (
                  <span
                    key={piece}
                    className={`hero-piece hero-piece-${piece}`}
                    data-hero-piece
                  />
                ))}
              </div>
              <img
                src="/images/hero_office.jpg"
                alt="Atendimento profissional em escritório corporativo"
              />
              <figcaption className="image-caption">
                Atendimento contábil com postura institucional, clareza e
                proximidade no dia a dia.
              </figcaption>
            </figure>
            <aside className="hero-live-card hero-reveal" data-hero-live>
              <div className="hero-live-header">
                <div className="hero-live-heading">
                  <span className="hero-live-pill">
                    <span className="hero-live-pulse" aria-hidden="true" />
                    API em tempo real
                  </span>
                  <h2 className="hero-live-title">Painel ao vivo</h2>
                </div>
                <span className={`hero-live-status ${isError ? "is-error" : ""}`}>
                  {statusText}
                </span>
              </div>
              <div className="live-list">
                <HeroLiveIndicators indicators={indicators} loading={loading} />
              </div>
            </aside>
          </div>
        </div>

        <div className="ticker-wrap">
          <div className="section-shell">
            <div className="ticker-header">
              <span className="ticker-label">Indicadores financeiros</span>
              <span className={`ticker-status ${isError ? "is-error" : ""}`}>
                {statusText}
              </span>
            </div>
            <div className="ticker" aria-live="polite">
              <div className="ticker-track">
                <IndicatorTicker indicators={indicators} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

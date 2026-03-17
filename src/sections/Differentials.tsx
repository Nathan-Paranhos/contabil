import { SectionHeading } from "../components/SectionHeading";
import { SiteIcon } from "../components/icons/SiteIcon";
import { differentials } from "../data/siteContent";

export function Differentials() {
  return (
    <section className="differentials-section" id="diferenciais">
      <div className="section-shell scroll-stage" data-scroll-stage>
        <div className="differentials-layout">
          <div className="differentials-media scroll-reveal">
            <img
              src="/images/differential_meeting.jpg"
              alt="Reunião corporativa com foco em indicadores e estratégia"
            />
            <div className="differentials-media-copy">
              <h3>Atendimento que combina postura técnica com proximidade.</h3>
              <p>
                A proposta da ACN é resolver demandas contábeis sem afastar o
                cliente do processo. Você recebe direção, contexto e resposta
                objetiva.
              </p>
            </div>
          </div>

          <div className="differentials-grid">
            <SectionHeading
              eyebrow="Diferenciais"
              title="Clareza para orientar. Estrutura para executar. Proximidade para apoiar."
              description="O escritório foi pensado para ser funcional no comercial e sólido no institucional, reforçando agilidade, segurança e suporte humanizado."
              className="scroll-reveal"
            />

            {differentials.map((item) => (
              <article key={item.title} className="diff-card scroll-reveal">
                <div className="diff-icon">
                  <SiteIcon name={item.icon} size={22} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

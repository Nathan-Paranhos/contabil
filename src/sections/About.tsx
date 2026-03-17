import { SectionHeading } from "../components/SectionHeading";
import { aboutStats } from "../data/siteContent";

export function About() {
  return (
    <section className="about-section" id="quem-somos">
      <div className="section-shell about-grid scroll-stage" data-scroll-stage>
        <div className="about-panel scroll-reveal">
          <SectionHeading
            eyebrow="Quem Somos"
            title="Uma presença contábil criada para simplificar rotinas e dar segurança às decisões."
          />
          <div className="about-story">
            <p>
              A ACN Contabilidade nasceu com a proposta de tornar o atendimento
              contábil mais direto, confiável e útil para a realidade do
              cliente. Em vez de uma comunicação distante, a atuação prioriza
              orientação clara, organização de processos e resposta rápida.
            </p>
            <p>
              Ao longo da jornada, a proposta institucional se consolidou em
              torno de três frentes: apoiar quem está começando um negócio,
              oferecer segurança para quem precisa manter a empresa regular e
              prestar atendimento objetivo para pessoas físicas em demandas como
              imposto de renda.
            </p>
            <p>
              Este texto foi estruturado como base institucional adaptável, para
              permitir futura evolução do posicionamento sem perder a linguagem
              premium e comercial da página.
            </p>
          </div>
          <div className="about-stats">
            {aboutStats.map((stat) => (
              <div key={stat.title} className="about-stat">
                <strong>{stat.title}</strong>
                <span>{stat.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-image scroll-reveal">
          <img
            src="/images/about_team.jpg"
            alt="Equipe da ACN Contabilidade em ambiente corporativo"
          />
        </div>
      </div>
    </section>
  );
}

import { SectionHeading } from "../components/SectionHeading";
import { SiteIcon } from "../components/icons/SiteIcon";
import { contactInfo, services } from "../data/siteContent";
import { buildWhatsAppUrl } from "../utils/whatsapp";

export function Services() {
  return (
    <section className="services-section" id="servicos">
      <div className="section-shell scroll-stage" data-scroll-stage>
        <SectionHeading
          eyebrow="Serviços e Soluções"
          title="Soluções principais para quem quer organizar, abrir ou manter a operação em dia."
          description="Estruturamos os serviços mais buscados em uma linguagem simples, com orientação prática e contato direto pelo WhatsApp para acelerar a conversão."
          className="scroll-reveal"
        />

        <div className="services-grid">
          {services.map((service) => (
            <article
              key={service.title}
              className={`service-card ${service.featured ? "featured" : ""} scroll-reveal`}
            >
              <div className="service-icon">
                <SiteIcon name={service.icon} size={22} />
              </div>
              <div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-copy">{service.description}</p>
              </div>
              <ul className="service-list">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="service-tags">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="service-footer">
                <span className="service-note">{service.note}</span>
              </div>
              <a
                className={`btn ${service.featured ? "btn-ghost" : "btn-secondary"}`}
                href={buildWhatsAppUrl(contactInfo.whatsappNumber, service.message)}
                target="_blank"
                rel="noreferrer"
              >
                <SiteIcon name="whatsapp" size={18} />
                Falar sobre este serviço
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

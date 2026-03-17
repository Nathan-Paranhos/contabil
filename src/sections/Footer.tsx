import { Brand } from "../components/Brand";
import { contactInfo, navItems } from "../data/siteContent";
import { buildWhatsAppUrl } from "../utils/whatsapp";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-shell scroll-stage" data-scroll-stage>
        <div className="footer-card">
          <div className="footer-grid">
            <div className="footer-brand">
              <a className="brand" href="#home" aria-label="Voltar ao topo">
                <Brand />
              </a>
              <p>
                Assessoria contábil institucional com foco em credibilidade,
                apoio prático e conversão direta pelo WhatsApp.
              </p>
            </div>

            <div className="footer-links">
              <h3>Links</h3>
              <ul>
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-contact">
              <h3>Contato</h3>
              <ul>
                <li>
                  <a
                    href={buildWhatsAppUrl(
                      contactInfo.whatsappNumber,
                      "Olá! Quero atendimento da ACN Contabilidade pelo WhatsApp.",
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {contactInfo.whatsappLabel}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </li>
                <li>
                  <span>{contactInfo.coverage}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              &copy; {new Date().getFullYear()} ACN Contabilidade. Todos os direitos reservados.
            </span>
            <a
              className="social-link"
              href={buildWhatsAppUrl(
                contactInfo.whatsappNumber,
                "Olá! Vim pelo site da ACN Contabilidade e quero atendimento.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Atendimento comercial via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

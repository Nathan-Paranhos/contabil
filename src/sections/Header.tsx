import { useState } from "react";

import { Brand } from "../components/Brand";
import { contactInfo, navItems } from "../data/siteContent";
import { SiteIcon } from "../components/icons/SiteIcon";
import { buildWhatsAppUrl } from "../utils/whatsapp";

type HeaderProps = {
  activeSection: string;
  isScrolled: boolean;
};

export function Header({ activeSection, isScrolled }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="section-shell header-inner">
        <a className="brand" href="#home" aria-label="Voltar ao topo">
          <Brand />
        </a>

        <nav className={`site-nav ${isMenuOpen ? "is-open" : ""}`} id="site-nav">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`nav-link ${item.href === `#${activeSection}` ? "is-active" : ""}`}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          className={`menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="site-nav"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span className="sr-only">Abrir navegação</span>
        </button>

        <a
          className="btn btn-primary header-cta"
          href={buildWhatsAppUrl(
            contactInfo.whatsappNumber,
            "Olá! Quero falar com a ACN Contabilidade sobre assessoria contábil.",
          )}
          target="_blank"
          rel="noreferrer"
        >
          <SiteIcon name="whatsapp" size={18} />
          Falar no WhatsApp
        </a>
      </div>
    </header>
  );
}

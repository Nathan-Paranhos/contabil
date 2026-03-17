import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { Services } from "./sections/Services";
import { Differentials } from "./sections/Differentials";
import { MarketSection } from "./sections/MarketSection";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { SiteIcon } from "./components/icons/SiteIcon";
import { contactInfo, navItems } from "./data/siteContent";
import { useActiveSection } from "./hooks/useActiveSection";
import { useEconomicIndicators } from "./hooks/useEconomicIndicators";
import { useHeaderScrolled } from "./hooks/useHeaderScrolled";
import { useLandingAnimations } from "./hooks/useLandingAnimations";
import { buildWhatsAppUrl } from "./utils/whatsapp";

const sectionIds = navItems.map((item) => item.href.slice(1));

export default function App() {
  const rootRef = useLandingAnimations();
  const activeSection = useActiveSection(sectionIds);
  const isScrolled = useHeaderScrolled();
  const { indicators, statusText, isError, isLoading } = useEconomicIndicators();

  return (
    <div ref={rootRef} className="page-shell">
      <Header activeSection={activeSection} isScrolled={isScrolled} />

      <main className="page-main">
        <Hero
          indicators={indicators}
          statusText={statusText}
          isError={isError}
          loading={isLoading}
        />
        <Services />
        <Differentials />
        <MarketSection
          indicators={indicators}
          statusText={statusText}
          isError={isError}
          loading={isLoading}
        />
        <About />
        <Contact />
      </main>

      <Footer />

      <a
        className="floating-wa"
        href={buildWhatsAppUrl(
          contactInfo.whatsappNumber,
          "Olá! Quero falar agora com a ACN Contabilidade.",
        )}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir conversa no WhatsApp"
      >
        <SiteIcon name="whatsapp" size={18} />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}

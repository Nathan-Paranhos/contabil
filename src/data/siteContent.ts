import type {
  AboutStat,
  ContactInfo,
  DifferentialItem,
  Indicator,
  IndicatorId,
  IndicatorMap,
  NavItem,
  ServiceItem,
} from "../types/site";

export const contactInfo: ContactInfo = {
  // Atualize estes dados antes da publicação final.
  whatsappNumber: "5511999999999",
  whatsappLabel: "(11) 99999-9999",
  email: "contato@acncontabilidade.com.br",
  coverage: "Atendimento online em todo o Brasil",
};

export const cacheConfig = {
  key: "acn-indicators-v3",
  ttlMs: 60 * 1000,
} as const;

export const liveConfig = {
  currencyRefreshMs: 15 * 1000,
  ratesRefreshMs: 15 * 60 * 1000,
} as const;

export const heroPoints = [
  "Atendimento para empresas, MEIs e IRPF",
  "WhatsApp com resposta rápida",
  "Indicadores econômicos atualizados",
];

export const navItems: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Serviços e Soluções", href: "#servicos" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Contato", href: "#contato" },
];

export const services: ServiceItem[] = [
  {
    title: "Abertura de Empresa",
    description:
      "Estruturamos a abertura do seu CNPJ com orientação clara sobre enquadramento, regime tributário e primeiras rotinas fiscais.",
    bullets: [
      "Análise inicial do perfil do negócio",
      "Orientação sobre CNAEs, natureza jurídica e tributação",
      "Acompanhamento até a formalização da operação",
    ],
    tags: ["MEI", "ME", "LTDA"],
    note: "Para quem quer começar com organização",
    message:
      "Olá! Quero abrir minha empresa e preciso de orientação sobre CNPJ, enquadramento e regime tributário.",
    icon: "company",
  },
  {
    title: "Imposto de Renda",
    description:
      "Cuidamos da sua declaração com segurança, revisão criteriosa das informações e apoio para reduzir riscos de inconsistências.",
    bullets: [
      "Declaração para pessoa física e profissionais liberais",
      "Organização de documentos e rendimentos",
      "Apoio em retificações e dúvidas pós-entrega",
    ],
    tags: ["IRPF", "Retificação", "Regularização"],
    note: "Atendimento direto e objetivo",
    message:
      "Olá! Preciso de ajuda com meu Imposto de Renda e gostaria de falar com a ACN Contabilidade.",
    icon: "tax",
    featured: true,
  },
  {
    title: "Assessoria Contábil",
    description:
      "Rotina contábil e fiscal acompanhada de perto para você tomar decisões com mais tranquilidade e manter a empresa regular.",
    bullets: [
      "Escrituração, obrigações e suporte recorrente",
      "Acompanhamento fiscal e orientação prática",
      "Atendimento próximo para decisões do dia a dia",
    ],
    tags: ["Empresas", "Suporte fiscal", "Notas e rotinas"],
    note: "Para quem busca continuidade e confiança",
    message:
      "Olá! Quero entender como funciona a assessoria contábil da ACN para minha empresa.",
    icon: "advisory",
  },
];

export const differentials: DifferentialItem[] = [
  {
    title: "Agilidade",
    description:
      "Processos organizados para reduzir demora, responder rápido e destravar demandas contábeis sem excesso de burocracia.",
    icon: "speed",
  },
  {
    title: "Segurança",
    description:
      "Condução técnica e cuidadosa para evitar retrabalho, inconsistências fiscais e decisões sem base contábil adequada.",
    icon: "shield",
  },
  {
    title: "Suporte humanizado",
    description:
      "Atendimento próximo, em linguagem clara, para que o cliente saiba o que fazer e entenda cada próxima etapa.",
    icon: "support",
  },
];

export const aboutStats: AboutStat[] = [
  {
    title: "Postura institucional",
    description: "Comunicação sóbria, clara e profissional.",
  },
  {
    title: "Foco comercial",
    description: "Site pensado para apresentação e conversão.",
  },
  {
    title: "Atendimento próximo",
    description: "Contato facilitado via WhatsApp em toda a página.",
  },
];

export const indicatorOrder: IndicatorId[] = [
  "dollar",
  "euro",
  "selic",
  "ipca",
  "cdi",
];

function createDefaultIndicator(
  id: IndicatorId,
  label: string,
  shortLabel: string,
  source: string,
  meta: string,
): Indicator {
  return {
    id,
    label,
    shortLabel,
    source,
    meta,
    value: "--",
    rawValue: null,
    change: "Carregando...",
    changeNumber: null,
    trend: "neutral",
  };
}

export const defaultIndicators: IndicatorMap = {
  dollar: createDefaultIndicator("dollar", "Dólar", "US$/BRL", "AwesomeAPI", "Câmbio comercial"),
  euro: createDefaultIndicator("euro", "Euro", "EUR/BRL", "AwesomeAPI", "Mercado à vista"),
  selic: createDefaultIndicator("selic", "Selic", "SELIC", "BrasilAPI", "Taxa básica"),
  ipca: createDefaultIndicator("ipca", "IPCA", "IPCA", "BrasilAPI", "Acumulado em 12 meses"),
  cdi: createDefaultIndicator("cdi", "CDI", "CDI", "BrasilAPI", "Taxa anual"),
};

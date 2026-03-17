export type NavItem = {
  label: string;
  href: `#${string}`;
};

export type ServiceItem = {
  title: string;
  description: string;
  bullets: string[];
  tags: string[];
  note: string;
  message: string;
  icon: "company" | "tax" | "advisory";
  featured?: boolean;
};

export type DifferentialItem = {
  title: string;
  description: string;
  icon: "speed" | "shield" | "support";
};

export type AboutStat = {
  title: string;
  description: string;
};

export type ContactInfo = {
  whatsappNumber: string;
  whatsappLabel: string;
  email: string;
  coverage: string;
};

export type IndicatorId = "dollar" | "euro" | "selic" | "ipca" | "cdi";

export type Trend = "up" | "down" | "neutral";

export type Indicator = {
  id: IndicatorId;
  label: string;
  shortLabel: string;
  source: string;
  meta: string;
  value: string;
  rawValue: number | null;
  change: string;
  changeNumber: number | null;
  trend: Trend;
};

export type IndicatorMap = Record<IndicatorId, Indicator>;

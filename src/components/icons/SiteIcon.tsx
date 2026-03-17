import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import {
  BadgePercent,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  Mail,
  MapPin,
  MessageCircleMore,
  ShieldCheck,
  WalletCards,
  Zap,
} from "lucide-react";

type SiteIconName =
  | "company"
  | "tax"
  | "advisory"
  | "speed"
  | "shield"
  | "support"
  | "whatsapp"
  | "message"
  | "mail"
  | "pin"
  | "currency"
  | "rates";

const iconMap = {
  company: Building2,
  tax: FileText,
  advisory: BriefcaseBusiness,
  speed: Zap,
  shield: ShieldCheck,
  support: MessageCircleMore,
  whatsapp: MessageCircleMore,
  message: WalletCards,
  mail: Mail,
  pin: MapPin,
  currency: BadgePercent,
  rates: BarChart3,
} satisfies Record<SiteIconName, ComponentType<LucideProps>>;

type SiteIconProps = LucideProps & {
  name: SiteIconName;
};

export function SiteIcon({ name, ...props }: SiteIconProps) {
  const Icon = iconMap[name];

  return <Icon aria-hidden="true" {...props} />;
}

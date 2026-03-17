export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatSignedPercent(value: number): string {
  const absolute = formatNumber(Math.abs(value));
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${absolute}%`;
}

export function formatSignedNumber(value: number): string {
  const absolute = formatNumber(Math.abs(value));
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return `${sign}${absolute}`;
}

export function formatTime(timestamp: number, withSeconds = false): string {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    ...(withSeconds ? { second: "2-digit" } : {}),
  }).format(timestamp);
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return `(${digits}`;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

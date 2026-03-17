import { useEffect, useState } from "react";

import {
  cacheConfig,
  defaultIndicators,
  liveConfig,
} from "../data/siteContent";
import type { Indicator, IndicatorId, IndicatorMap, Trend } from "../types/site";
import {
  formatCurrency,
  formatNumber,
  formatSignedNumber,
  formatSignedPercent,
  formatTime,
} from "../utils/formatters";

type IndicatorHookState = {
  indicators: IndicatorMap;
  statusText: string;
  isError: boolean;
  isLoading: boolean;
};

type CachedIndicators = {
  timestamp: number;
  data: IndicatorMap;
};

export function useEconomicIndicators(): IndicatorHookState {
  const [state, setState] = useState<IndicatorHookState>({
    indicators: defaultIndicators,
    statusText: "Carregando indicadores em tempo real...",
    isError: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const cached = readCache();
    let latestIndicators = cloneIndicators(cached?.data ?? defaultIndicators);

    if (cached?.data && isMounted) {
      setState({
        indicators: cached.data,
        statusText: cached.stale
          ? `Painel retomado do cache de ${formatTime(cached.timestamp, true)} enquanto sincronizamos ao vivo...`
          : `Painel ao vivo iniciado com cache de ${formatTime(cached.timestamp, true)}.`,
        isError: false,
        isLoading: false,
      });
    }

    const syncAllIndicators = async () => {
      const [currencyResult, ratesResult] = await Promise.allSettled([
        fetchCurrencyIndicators(latestIndicators),
        fetchRateIndicators(latestIndicators),
      ]);

      const nextIndicators = cloneIndicators(latestIndicators);
      let hasLiveData = false;
      let hasCurrencyData = false;
      let hasPartialFailure = false;

      if (currencyResult.status === "fulfilled") {
        Object.assign(nextIndicators, currencyResult.value);
        hasLiveData = true;
        hasCurrencyData = true;
      } else {
        hasPartialFailure = true;
      }

      if (ratesResult.status === "fulfilled") {
        Object.assign(nextIndicators, ratesResult.value);
        hasLiveData = true;
      } else {
        hasPartialFailure = true;
      }

      if (!isMounted) {
        return;
      }

      if (!hasLiveData && cached?.data) {
        setState({
          indicators: cached.data,
          statusText: `Sem resposta das APIs no momento. Mantendo a última atualização disponível (${formatTime(cached.timestamp)}).`,
          isError: true,
          isLoading: false,
        });
        return;
      }

      if (!hasLiveData) {
        setState({
          indicators: defaultIndicators,
          statusText: "Não foi possível carregar os indicadores agora. Tente novamente em instantes.",
          isError: true,
          isLoading: false,
        });
        return;
      }

      const updatedAt = Date.now();
      latestIndicators = nextIndicators;
      writeCache(nextIndicators, updatedAt);

      setState({
        indicators: nextIndicators,
        statusText: hasCurrencyData
          ? hasPartialFailure
            ? `Câmbio ao vivo às ${formatTime(updatedAt, true)}. Parte dos dados macro foi mantida do cache local.`
            : `Câmbio ao vivo às ${formatTime(updatedAt, true)}.`
          : `Taxas macro atualizadas, mas o câmbio ao vivo não respondeu nesta leitura.`,
        isError: !hasCurrencyData,
        isLoading: false,
      });
    };

    const syncCurrencies = async () => {
      try {
        const currencyIndicators = await fetchCurrencyIndicators(latestIndicators);
        const updatedAt = Date.now();

        latestIndicators = {
          ...latestIndicators,
          ...currencyIndicators,
        };

        writeCache(latestIndicators, updatedAt);

        if (!isMounted) {
          return;
        }

        setState({
          indicators: cloneIndicators(latestIndicators),
          statusText: `Câmbio ao vivo no painel do hero às ${formatTime(updatedAt, true)}.`,
          isError: false,
          isLoading: false,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        const fallback = readCache();

        if (fallback?.data) {
          latestIndicators = cloneIndicators(fallback.data);

          setState({
            indicators: fallback.data,
            statusText: `Sem resposta do câmbio em tempo real. Mantendo a leitura de ${formatTime(fallback.timestamp, true)}.`,
            isError: true,
            isLoading: false,
          });
          return;
        }

        setState((current) => ({
          ...current,
          statusText: "Sem resposta do câmbio em tempo real agora. Tente novamente em instantes.",
          isError: true,
          isLoading: false,
        }));
      }
    };

    const syncRates = async () => {
      try {
        const rateIndicators = await fetchRateIndicators(latestIndicators);
        const updatedAt = Date.now();

        latestIndicators = {
          ...latestIndicators,
          ...rateIndicators,
        };

        writeCache(latestIndicators, updatedAt);

        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          indicators: cloneIndicators(latestIndicators),
        }));
      } catch {
        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          isError: current.isError,
        }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncCurrencies();
      }
    };

    void syncAllIndicators();

    const currencyInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncCurrencies();
      }
    }, liveConfig.currencyRefreshMs);

    const ratesInterval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncRates();
      }
    }, liveConfig.ratesRefreshMs);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.clearInterval(currencyInterval);
      window.clearInterval(ratesInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return state;
}

async function fetchCurrencyIndicators(previousIndicators: IndicatorMap) {
  const response = await fetch(
    "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL",
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    throw new Error("Falha ao carregar câmbio.");
  }

  const data = (await response.json()) as {
    USDBRL?: AwesomeCurrency;
    EURBRL?: AwesomeCurrency;
  };

  return {
    dollar: normalizeCurrencyIndicator("dollar", data.USDBRL, previousIndicators.dollar),
    euro: normalizeCurrencyIndicator("euro", data.EURBRL, previousIndicators.euro),
  } satisfies Partial<IndicatorMap>;
}

async function fetchRateIndicators(previousIndicators: IndicatorMap) {
  const response = await fetch("https://brasilapi.com.br/api/taxas/v1", {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar taxas.");
  }

  const rates = (await response.json()) as BrasilApiRate[];
  const ratesByName = Object.fromEntries(
    rates.map((rate) => [String(rate.nome || "").toLowerCase(), rate]),
  );

  return {
    selic: normalizeRateIndicator(
      "selic",
      "Selic",
      ratesByName.selic?.valor,
      "Taxa básica",
      previousIndicators.selic,
    ),
    ipca: normalizeRateIndicator(
      "ipca",
      "IPCA",
      ratesByName.ipca?.valor,
      "Acumulado em 12 meses",
      previousIndicators.ipca,
    ),
    cdi: normalizeRateIndicator(
      "cdi",
      "CDI",
      ratesByName.cdi?.valor,
      "Taxa anual",
      previousIndicators.cdi,
    ),
  } satisfies Partial<IndicatorMap>;
}

function normalizeCurrencyIndicator(
  id: IndicatorId,
  apiItem: AwesomeCurrency | undefined,
  previous: Indicator,
): Indicator {
  const value = Number(apiItem?.bid ?? 0);
  const change = Number(apiItem?.pctChange ?? 0);

  return {
    id,
    label: id === "dollar" ? "Dólar" : "Euro",
    shortLabel: id === "dollar" ? "US$/BRL" : "EUR/BRL",
    source: "AwesomeAPI",
    meta: id === "dollar" ? "Câmbio comercial" : "Mercado à vista",
    value: formatCurrency(value),
    rawValue: value,
    change: formatSignedPercent(change),
    changeNumber: change,
    trend: resolveTrend(change, previous.rawValue, value),
  };
}

function normalizeRateIndicator(
  id: IndicatorId,
  label: string,
  rawValue: number | undefined,
  meta: string,
  previous: Indicator,
): Indicator {
  const value = Number(rawValue ?? 0);
  const difference = Number.isFinite(previous.rawValue)
    ? value - Number(previous.rawValue)
    : 0;
  const hasPrevious = Number.isFinite(previous.rawValue);

  return {
    id,
    label,
    shortLabel: label.toUpperCase(),
    source: "BrasilAPI",
    meta,
    value: `${formatNumber(value)}%`,
    rawValue: value,
    change: hasPrevious ? `${formatSignedNumber(difference)} p.p.` : "Base atual",
    changeNumber: difference,
    trend: hasPrevious ? resolveTrend(difference) : "neutral",
  };
}

function resolveTrend(
  change: number,
  previousValue: number | null = null,
  currentValue: number | null = null,
): Trend {
  if (Number.isFinite(change) && change !== 0) {
    return change > 0 ? "up" : "down";
  }

  const hasComparableValues =
    typeof previousValue === "number" && typeof currentValue === "number";

  if (hasComparableValues && previousValue !== currentValue) {
    return currentValue > previousValue ? "up" : "down";
  }

  return "neutral";
}

function cloneIndicators(indicators: IndicatorMap): IndicatorMap {
  return JSON.parse(JSON.stringify(indicators)) as IndicatorMap;
}

function readCache() {
  try {
    const raw = localStorage.getItem(cacheConfig.key);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedIndicators;

    if (!parsed?.timestamp || !parsed?.data) {
      return null;
    }

    return {
      ...parsed,
      stale: Date.now() - parsed.timestamp > cacheConfig.ttlMs,
    };
  } catch {
    return null;
  }
}

function writeCache(data: IndicatorMap, timestamp: number) {
  try {
    const payload: CachedIndicators = { data, timestamp };
    localStorage.setItem(cacheConfig.key, JSON.stringify(payload));
  } catch {
    // Ignora falhas de escrita no cache local.
  }
}

type AwesomeCurrency = {
  bid?: string;
  pctChange?: string;
};

type BrasilApiRate = {
  nome?: string;
  valor?: number;
};

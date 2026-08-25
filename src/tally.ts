const TALLY_FORM_URL = "https://tally.so/r/q4XxJ2";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export function tallyUrl(context: Record<string, string>) {
  const params = new URLSearchParams(context);

  if (typeof window !== "undefined") {
    const currentParams = new URLSearchParams(window.location.search);

    UTM_KEYS.forEach((key) => {
      const value = currentParams.get(key);
      if (value) params.set(key, value);
    });
  }

  return `${TALLY_FORM_URL}?${params.toString()}`;
}

export function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

export function buildSearch(...parts: string[]) {
  return normalizeSearch(parts.filter(Boolean).join(" "));
}

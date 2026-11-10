import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/ca";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ca: () => import("./dictionaries/ca").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

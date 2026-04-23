export type CardFunding = "credit" | "debit" | "unknown";

/**
 * Parses the first 6–8 digits the client collected from the PAN (before tokenization).
 * PCI: never log or persist the full card number; only this prefix is used for BIN rules.
 */
export function normalizeCardBinPrefix(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length < 6 || digits.length > 8) return null;
  return digits;
}

/** Six-digit issuer prefix used for lists / ranges. */
function bin6(prefix: string): string {
  return prefix.slice(0, 6);
}

/**
 * Curated six-digit BINs commonly issued as **debit** in the US.
 * Expand this set over time to reduce accidental credit surcharges.
 * Visa/Mastercard numbers not matching debit signals default to **credit** (fee applies).
 */
const DEBIT_BIN_6 = new Set<string>([
  "400022",
  "401288",
  "403784",
  "404591",
  "406095",
  "406042",
  "408544",
  "411116",
  "413331",
  "414398",
  "414720",
  "415712",
  "418555",
  "420767",
  "421783",
  "423223",
  "424631",
  "425907",
  "426690",
  "428208",
  "431935",
  "433281",
  "440393",
  "441104",
  "442555",
  "446542",
  "448233",
  "450003",
  "451401",
  "452088",
  "453598",
  "454313",
  "455036",
  "457173",
  "459954",
  "460905",
  "464018",
  "465345",
  "468005",
  "472776",
  "474476",
  "475823",
  "476153",
  "478200",
  "481582",
  "483312",
  "486796",
  "489000",
  "510805",
  "514377",
  "516586",
  "517546",
  "518941",
  "520082",
  "521333",
  "522189",
  "523080",
  "524366",
  "525475",
  "526219",
  "527526",
  "528013",
  "529099",
  "530993",
  "531260",
  "533248",
  "534860",
  "536613",
  "537989",
  "541592",
  "542418",
  "543446",
  "544612",
  "545533",
  "546616",
  "547415",
  "548742",
  "549113",
  "550209",
  "601100",
  "601101",
  "601174",
]);

function isLikelyDebitBin6(b6: string): boolean {
  return DEBIT_BIN_6.has(b6);
}

/**
 * Infer credit vs debit from BIN prefix only (no network guarantee).
 * Keep logic aligned with the frontend copy in `frontend/src/lib/cardFundingFromBin.ts`.
 */
export function inferCardFundingFromBinPrefix(prefix: string): CardFunding {
  const digits = prefix.replace(/\D/g, "").slice(0, 8);
  if (digits.length < 6) return "unknown";
  const b6 = bin6(digits);
  if (isLikelyDebitBin6(b6)) return "debit";

  // American Express — treated as credit for surcharge display/settlement.
  if (/^3[47]\d{4}/.test(digits)) return "credit";

  if (/^4\d{5}/.test(digits)) return "credit";
  if (/^(5[1-5]|2(2(2[1-9]|[3-9]\d)|[3-6]\d{2}|7[01]\d|720))\d{2}/.test(digits)) {
    return "credit";
  }
  if (/^6(?:011|5\d{2})\d{2}/.test(digits)) return "credit";

  return "unknown";
}

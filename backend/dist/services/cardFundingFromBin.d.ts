export type CardFunding = "credit" | "debit" | "unknown";
/**
 * Parses the first 6–8 digits the client collected from the PAN (before tokenization).
 * PCI: never log or persist the full card number; only this prefix is used for BIN rules.
 */
export declare function normalizeCardBinPrefix(raw: unknown): string | null;
/**
 * Infer credit vs debit from BIN prefix only (no network guarantee).
 * Keep logic aligned with the frontend copy in `frontend/src/lib/cardFundingFromBin.ts`.
 */
export declare function inferCardFundingFromBinPrefix(prefix: string): CardFunding;
//# sourceMappingURL=cardFundingFromBin.d.ts.map
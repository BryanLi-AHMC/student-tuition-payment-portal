/** Rate applied only when server classifies funding as credit (see `cardFundingFromBin.ts`). */
export declare const CREDIT_CARD_PROCESSING_FEE_RATE = 0.03;
export declare function roundMoney2(value: number): number;
export declare function computeCreditCardProcessingFee(baseAmount: number, funding: "credit" | "debit" | "unknown"): number;
export declare function totalChargeWithProcessingFee(baseAmount: number, funding: "credit" | "debit" | "unknown"): {
    base: number;
    fee: number;
    total: number;
};
/**
 * When refunding a portion of the tuition/base amount, refund the same proportion
 * of the original processing fee (Authorize.net refunds are manual in this app).
 */
export declare function proportionalProcessingFeeRefund(args: {
    originalBase: number;
    originalFee: number;
    refundBase: number;
}): number;
//# sourceMappingURL=creditCardProcessingFee.d.ts.map
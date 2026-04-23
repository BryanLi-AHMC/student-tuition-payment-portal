/** Rate applied only when server classifies funding as credit (see `cardFundingFromBin.ts`). */
export const CREDIT_CARD_PROCESSING_FEE_RATE = 0.03;
export function roundMoney2(value) {
    return Math.round(value * 100) / 100;
}
export function computeCreditCardProcessingFee(baseAmount, funding) {
    const base = roundMoney2(Math.max(0, baseAmount));
    if (funding !== "credit" || base <= 0)
        return 0;
    return roundMoney2(base * CREDIT_CARD_PROCESSING_FEE_RATE);
}
export function totalChargeWithProcessingFee(baseAmount, funding) {
    const base = roundMoney2(Math.max(0, baseAmount));
    const fee = computeCreditCardProcessingFee(base, funding);
    return { base, fee, total: roundMoney2(base + fee) };
}
/**
 * When refunding a portion of the tuition/base amount, refund the same proportion
 * of the original processing fee (Authorize.net refunds are manual in this app).
 */
export function proportionalProcessingFeeRefund(args) {
    const ob = roundMoney2(Math.max(0, args.originalBase));
    const of = roundMoney2(Math.max(0, args.originalFee));
    const rb = roundMoney2(Math.max(0, args.refundBase));
    if (ob <= 0 || of <= 0 || rb <= 0)
        return 0;
    const ratio = Math.min(1, rb / ob);
    return roundMoney2(of * ratio);
}
//# sourceMappingURL=creditCardProcessingFee.js.map
import type { CardFunding } from '@/lib/cardFundingFromBin'

export const CREDIT_CARD_PROCESSING_FEE_RATE = 0.03

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

export function computeCreditCardProcessingFee(baseAmount: number, funding: CardFunding): number {
  const base = roundMoney(Math.max(0, baseAmount))
  if (funding !== 'credit' || base <= 0) return 0
  return roundMoney(base * CREDIT_CARD_PROCESSING_FEE_RATE)
}

export function totalWithProcessingFee(baseAmount: number, funding: CardFunding): number {
  const base = roundMoney(Math.max(0, baseAmount))
  return roundMoney(base + computeCreditCardProcessingFee(base, funding))
}

/** Same formula as `backend/src/services/creditCardProcessingFee.ts` — for admin refunds. */
export function proportionalProcessingFeeRefund(args: {
  originalBase: number
  originalFee: number
  refundBase: number
}): number {
  const ob = roundMoney(Math.max(0, args.originalBase))
  const of = roundMoney(Math.max(0, args.originalFee))
  const rb = roundMoney(Math.max(0, args.refundBase))
  if (ob <= 0 || of <= 0 || rb <= 0) return 0
  const ratio = Math.min(1, rb / ob)
  return roundMoney(of * ratio)
}

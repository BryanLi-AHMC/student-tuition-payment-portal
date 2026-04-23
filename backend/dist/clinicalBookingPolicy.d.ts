/**
 * Clinical timetable registration: seat is reserved immediately; payment must
 * complete within this window (server UTC) or the booking is revoked.
 */
export declare const CLINICAL_BOOKING_PAYMENT_WINDOW_HOURS = 3;
export declare function clinicalBookingPaymentDeadlineMsFromCreatedAt(createdAtMs: number): number;
/** `paymentDeadlineUtc` is the stored `hold_expires_at` instant (UTC). */
export declare function isClinicalBookingExpired(paymentDeadlineUtc: Date, nowMs?: number): boolean;
//# sourceMappingURL=clinicalBookingPolicy.d.ts.map
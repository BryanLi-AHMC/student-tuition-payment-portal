export type LedgerQuarterOption = {
    term: string;
    year: number;
    label: string;
};
export type LedgerRowDto = {
    date: string;
    type: string;
    code: string;
    memo: string;
    debit: number;
    credit: number;
};
export type LedgerSummaryDto = {
    totalCharges: number;
    totalPayments: number;
    balance: number;
};
export declare function getAccountingQuartersPayload(studentId: string): Promise<{
    studentId: string;
    quarters: LedgerQuarterOption[];
}>;
export declare function getAccountingLedgerPayload(studentId: string, term: string, year: number): Promise<{
    studentId: string;
    term: string;
    year: number;
    rows: LedgerRowDto[];
    summary: LedgerSummaryDto;
} | null>;
//# sourceMappingURL=studentLedgerService.d.ts.map
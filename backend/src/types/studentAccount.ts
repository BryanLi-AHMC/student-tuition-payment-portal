export type BillingCategory = "tuition" | "clinical" | "fees" | "other";

export type BillingLineItem = {
  description: string;
  amount: number;
  category: BillingCategory;
};

export type StudentAccountSummary = {
  tuitionTotal: number;
  clinicalTotal: number;
  feesTotal: number;
  otherTotal: number;
  /** Legacy real students (Step 3B+): sum of `accounting.debit` for the term (signed). */
  totalCharges: number;
  /** Legacy real students (Step 3B+): sum of `accounting.credit` for the term. */
  payments: number;
  /** Legacy: sum(debit) − sum(credit) for the term when accounting rows exist. */
  outstandingBalance: number;
};

export type ScheduleRow = {
  courseCode: string;
  title: string;
  type: string;
  units: number | null;
  hours: number | null;
  charge: number;
  /** Meeting pattern when available (e.g. legacy `marks` days/times). */
  schedule?: string | null;
  /** Location or instructor line when available. */
  location?: string | null;
};

/** Resolved academic quarter for dashboard / current-term views. */
export type AccountCurrentTerm = {
  term: string;
  year: number;
  label: string;
  quarterOrder?: number;
};

export type AccountRegistrationStatus =
  | "registered"
  | "not_registered"
  | "in_progress"
  | "unknown";

export type AccountRegistration = {
  status: AccountRegistrationStatus;
  hasActiveCourses: boolean;
  courseCount: number;
  totalUnits: number | null;
  emptyReason?: string;
};

export type StudentTermPreference = {
  useInstallmentPlan: boolean;
  tuitionPaidInFullDuringRegistration: boolean;
  installmentCount: number;
  registrationPeriodEnds: string;
};

export type PaymentRecord = {
  amount: number;
  paidAt: string;
  /** Demo/portal rows use stored method; legacy `accounting` rows use `"legacy"` when unknown. */
  method: string;
  description?: string;
};

export type InstallmentScheduleEntry = {
  installment: number;
  dueDate: string;
  amount: number;
};

export type StudentAccountPayload = {
  program: string | null;
  term: string;
  year: number;
  studentId: string;
  /** Display profile block aligned with the portal UI (TopBar / Profile). */
  student: {
    name: string;
    studentId: string;
    term: string;
    year: number;
  };
  preference: StudentTermPreference | null;
  lineItems: BillingLineItem[];
  summary: StudentAccountSummary;
  scheduleRows: ScheduleRow[];
  currentTerm: AccountCurrentTerm;
  registration: AccountRegistration;
  payments: PaymentRecord[];
  installmentSchedule: InstallmentScheduleEntry[];
  installmentPolicy: string[];
  billingStatus: string | null;
  termChargeEffectiveDate: string | null;
};

export type EnrollmentRecord = {
  studentId: string;
  courseId: string;
  term: string;
  year: number;
};

export type CourseRecord = {
  courseId: string;
  courseCode: string;
  title: string;
  type: "didactic" | "clinical" | "lab" | "other";
  units?: number;
  hours?: number;
};

export type BillingAdjustmentRecord = {
  description: string;
  amount: number;
  category: BillingCategory;
};

/** Raw rows loaded from MySQL for one student term */
export type AccountContext = {
  studentId: string;
  /** From portal_students.full_name when present */
  studentDisplayName: string | null;
  term: string;
  year: number;
  enrollments: EnrollmentRecord[];
  preference: StudentTermPreference | null;
  payments: PaymentRecord[];
  adjustments: BillingAdjustmentRecord[];
  courses: CourseRecord[];
};

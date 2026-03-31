/** Static mock data for the portal homepage — replace with API integration later. */

export type DashboardService = {
  to: string
  title: string
  icon: 'registration' | 'finances' | 'academics' | 'clinical' | 'documents' | 'account'
}

export const DASHBOARD_SERVICES: DashboardService[] = [
  {
    to: '/registration',
    title: 'Registration',
    icon: 'registration',
  },
  {
    to: '/finances',
    title: 'Finances',
    icon: 'finances',
  },
  {
    to: '/academics',
    title: 'Academics',
    icon: 'academics',
  },
  {
    to: '/clinical',
    title: 'Clinical',
    icon: 'clinical',
  },
  {
    to: '/documents',
    title: 'Documents',
    icon: 'documents',
  },
  {
    to: '/profile',
    title: 'My Account',
    icon: 'account',
  },
]

export type DashboardCourse = {
  id: string
  code: string
  title: string
  credits: number
  section: string
  schedule: string
  location: string
}

export const DASHBOARD_COURSES_MOCK: DashboardCourse[] = [
  {
    id: 'c1',
    code: 'BIOC 510',
    title: 'Biochemistry I',
    credits: 4,
    section: '001 — Lecture',
    schedule: 'Mon & Wed, 9:00 AM – 10:50 AM',
    location: 'Science Hall 204',
  },
  {
    id: 'c2',
    code: 'ICM 501',
    title: 'Introduction to Clinical Medicine',
    credits: 5,
    section: '002 — Lecture / Small group',
    schedule: 'Mon, 11:00 AM – 12:15 PM; Thu, 11:00 AM – 12:15 PM',
    location: 'Health Sciences Bldg 112',
  },
  {
    id: 'c3',
    code: 'ANAT 520L',
    title: 'Gross Anatomy — Laboratory',
    credits: 2,
    section: '001 — Lab',
    schedule: 'Mon & Wed, 1:00 PM – 3:50 PM',
    location: 'Anatomy Lab Suite',
  },
  {
    id: 'c4',
    code: 'PHYS 515',
    title: 'Physiology',
    credits: 4,
    section: '001 — Lecture',
    schedule: 'Tue & Thu, 8:00 AM – 9:50 AM',
    location: 'Biomedical Sciences 145',
  },
  {
    id: 'c5',
    code: 'ETHM 505',
    title: 'Ethics in Medicine',
    credits: 2,
    section: '001 — Seminar',
    schedule: 'Mon, 4:30 PM – 5:45 PM',
    location: 'Virtual (synchronous)',
  },
]

export type DashboardImportantDate = {
  dayMonth: string
  label: string
}

export const DASHBOARD_IMPORTANT_DATES_MOCK: DashboardImportantDate[] = [
  { dayMonth: 'Apr 4', label: 'Spring holiday' },
  { dayMonth: 'Apr 8', label: 'Biochemistry Exam I' },
  { dayMonth: 'Apr 15', label: 'Registration opens' },
  { dayMonth: 'Apr 22', label: 'Anatomy practical review' },
]

export const DASHBOARD_ACCOUNT_SUMMARY_MOCK = {
  currentBalance: '$1,248.50',
  nextPaymentDue: 'Apr 10 — $450.00',
  holds: 'None',
} as const


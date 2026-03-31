/** Static mock data for the portal homepage — replace with API integration later. */

export type DashboardService = {
  to: string
  title: string
  description: string
  icon: 'registration' | 'finances' | 'academics' | 'clinical' | 'documents' | 'account'
}

export const DASHBOARD_SERVICES: DashboardService[] = [
  {
    to: '/registration',
    title: 'Registration',
    description: 'Enroll, adjust your schedule, and view registration status for the current term.',
    icon: 'registration',
  },
  {
    to: '/finances',
    title: 'Finances',
    description: 'Account balance, payments, billing history, statements, and payment plans.',
    icon: 'finances',
  },
  {
    to: '/academics',
    title: 'Academics',
    description: 'Grades, transcripts, GPA, degree progress, and enrollment verification.',
    icon: 'academics',
  },
  {
    to: '/clinical',
    title: 'Clinical',
    description: 'Clinical scheduling, compliance, evaluations, and required hours.',
    icon: 'clinical',
  },
  {
    to: '/documents',
    title: 'Documents',
    description: 'Policies, forms, handbook, and secure uploads for student records.',
    icon: 'documents',
  },
  {
    to: '/profile',
    title: 'My Account',
    description: 'Profile, contact preferences, and sign-in settings for your portal account.',
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


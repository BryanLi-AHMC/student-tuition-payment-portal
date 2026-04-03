/**
 * Static training quiz definitions for the Documents module.
 * Replace or augment with API-driven data when backend is available.
 */

export type DocumentQuizId = 'ferpa' | 'title-ix' | 'campus-safety'

export type DocumentQuizQuestion = {
  /** Stable id for form state and future API payloads */
  id: string
  prompt: string
  options: string[]
}

export type DocumentQuizDefinition = {
  id: DocumentQuizId
  title: string
  description: string
  questions: DocumentQuizQuestion[]
  /** Long-form certification paragraph shown above the checkbox */
  certificationText: string
}

export const DOCUMENT_QUIZZES: DocumentQuizDefinition[] = [
  {
    id: 'ferpa',
    title: 'FERPA',
    description:
      'Please complete the policy training below.',
    questions: [
      {
        id: 'ferpa-q1',
        prompt:
          'What is, due to FERPA rights, only allowed to be seen by the parents and eligible student?',
        options: [
          'Student Education Records',
          'Teacher Feedback',
          'Student Progress Chart',
          'Previous Student Projects',
        ],
      },
      {
        id: 'ferpa-q2',
        prompt:
          'Who, other than the parents and the eligible student, is allowed to view the student\'s education records with limitations?',
        options: [
          'Family Doctor',
          'Distant Family Relatives',
          'Juvenile Correctional Facilities',
          'The student\'s peers',
        ],
      },
      {
        id: 'ferpa-q3',
        prompt:
          'In what way can the access of student information affect the results of the teacher\'s success?',
        options: [
          'Accidental release of information may cause conflict.',
          'A disagreement over a final grade can cause conflict between student and teacher.',
          'Incorrectly inserting a grade can affect a student\'s success, therefore reflecting badly on the teacher.',
          'Printing off and losing copies may result in accidental release of information to the wrong people, therefore creating a privacy problem for the teacher and student.',
        ],
      },
      {
        id: 'ferpa-q4',
        prompt: 'What information is public to anyone who asks?',
        options: [
          'Student previous projects',
          'Artwork',
          'Student address and phone number',
          'Cumulative GPA',
        ],
      },
      {
        id: 'ferpa-q5',
        prompt: 'What age are students considered "eligible students?"',
        options: ['13', '15', '21', '18'],
      },
    ],
    certificationText:
      'By clicking Submit button, this is to certify that I have taken time to complete the AMU FERPA policy training. I agree to comply with FERPA policy and procedure as applicable to my employment. This will be expected as part of my continued employment with AMU. The above completed answer sheet to a set of five questions to ensure that I have a clear understanding of the FERPA policy.',
  },
  {
    id: 'title-ix',
    title: 'Title IX',
    description:
      'Please complete the policy training below.',
    questions: [
      {
        id: 'titleix-q1',
        prompt: 'Which of the following options is part of sexual misconduct?',
        options: [
          'Physical sexual acts perpetrated against a person\'s will or where a person is incapable of giving consent.',
          'An act committed through non-consensual abuse or exploitation of another person\'s sexuality for the purpose of sexual gratification.',
          'Unwanted or inappropriate sexual innuendos, sexual attention, propositions, or suggestive comments and gestures',
          'All of the above are true',
        ],
      },
      {
        id: 'titleix-q2',
        prompt:
          'Beth complains to her roommate that her co-worker continues to make inappropriate references to intimate body parts at work. Beth is afraid to ask the co-worker to stop because they might retaliate by giving her a bad review or by embarrassing her. What should her roommate do?',
        options: [
          'She should remind Beth that she has always been a sensitive person and maybe it was only her that was affected by the comments.',
          'She should tell Beth to ignore their behavior because it will probably stop soon.',
          'She should encourage her to tell the co-worker what she finds offensive and get help from the Title IX coordinator if necessary.',
          'She should not get involved because she has not seen it happen.',
        ],
      },
      {
        id: 'titleix-q3',
        prompt: 'Which of the following is NOT true about stalking?',
        options: [
          'Stalking is repeatedly following, monitoring, harassing, threatening, or intimidating another person.',
          'Stalking is only okay if it is acceptable in your culture',
          'Stalking is illegal in the United States.',
          'Stalking is when a girl follows a boy to all of his classes every day.',
        ],
      },
      {
        id: 'titleix-q4',
        prompt: 'This is not an example of sexual harassment/misconduct:',
        options: [
          'Improper touch',
          'When someone asks you out and you explain you\'re not interested; then continue to ask, text, and talk to you anyways.',
          'A faculty member gives you certain parameters to get a good grade based on you getting involved with them in some way.',
          'A stranger smiling and making eye contact with you in the hall.',
        ],
      },
      {
        id: 'titleix-q5',
        prompt:
          'Using social media to intimidate an individual against their will is not bullying.',
        options: ['True', 'False'],
      },
    ],
    certificationText:
      'By clicking Submit button, this is to certify that I have taken time to complete the AMU Title IX policy training. I agree to comply with Title IX policy and procedure as applicable to my employment. This will be expected as part of my continued employment with AMU. The above completed answer sheet to a set of five questions to ensure that I have a clear understanding of the Title IX policy.',
  },
  {
    id: 'campus-safety',
    title: 'Campus Safety',
    description:
      'Please complete the policy training below.',
    questions: [
      {
        id: 'campus-q1',
        prompt:
          'Clery Act is the consumer protection law requiring colleges and university to publish annual crime statistics and campus safety and security information. The Jeanne Clery Disclosure of Campus Security Policy and Campus Crime Statistics Act of 1998 is part of the Higher Education Act.',
        options: ['True', 'False'],
      },
      {
        id: 'campus-q2',
        prompt:
          'The goal of Clery Act is to ensure students, prospective students, parents and employees have access to accurate information about crimes committed on campus and campus security procedures.',
        options: ['True', 'False'],
      },
      {
        id: 'campus-q3',
        prompt:
          'All students and employees are required to report any crime or emergency to their institutional official promptly.',
        options: ['True', 'False'],
      },
      {
        id: 'campus-q4',
        prompt:
          'Which of the following is considered as exercise proper care in seeing to their personal safety and the safety of others?',
        options: [
          'Do not leave personal property in classrooms',
          'Report any suspicious persons to your institutional official',
          'Always try to walk in groups outside the school premises',
          'All of the above is correct',
        ],
      },
      {
        id: 'campus-q5',
        prompt:
          'Which of the following incident that is not included as condition to be classified as a Burglary?',
        options: [
          'There must be evidence of unlawful entry (trespass). Both forcible entry and unlawful entry (no force are counted)',
          'The entry into a structure where the intent cannot be determined',
          'The unlawful entry must occur within a structure, which is defined as having four walls, a roof, and a door',
          'The unlawful entry into a structure must show evidence that the entry was made in order to commit a felony or theft',
        ],
      },
    ],
    certificationText:
      'By clicking Submit button, this is to certify that I have taken time to complete the AMU Campus Safety policy training. I agree to comply with Campus Safety policy and procedure as applicable to my employment. This will be expected as part of my continued employment with AMU. The above completed answer sheet to a set of five questions to ensure that I have a clear understanding of the Campus Safety policy.',
  },
]

export function getDocumentQuizById(
  id: DocumentQuizId,
): DocumentQuizDefinition | undefined {
  return DOCUMENT_QUIZZES.find((q) => q.id === id)
}

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon?: string;
}

export interface UserStats {
  reportsUsed: number;
  dailyLimit: number;
  renewsIn: string;
  targetOverall: number;
  targetType: string;
}

export interface TaskItem {
  id: string;
  title: string;
  completed: boolean;
  action?: string;
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  { key: 'home', label: 'Home' },
  { key: 'reports', label: 'My Reports' },
  { key: 'writing', label: 'Writing' },
  { key: 'speaking', label: 'Speaking' },
  { key: 'rewriter', label: 'Rewriter' },
  { key: 'sample-reports', label: 'Sample Reports' },
  { key: 'lessons', label: 'Lessons' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'support', label: 'Support' },
];

export const USER_STATS: UserStats = {
  reportsUsed: 0,
  dailyLimit: 2,
  renewsIn: '14 hours',
  targetOverall: 8.0,
  targetType: 'IELTS General',
};

export const TASKS: TaskItem[] = [
  { id: '1', title: 'Add your target score', completed: true },
  { id: '2', title: 'Learn your speaking level', completed: false, action: 'start' },
];

export interface WritingTopic {
  id: string;
  type: string;
  question: string;
  tips: string[];
  vocabulary: string[];
}

export const WRITING_TOPICS: WritingTopic[] = [
  {
    id: '1',
    type: 'Writing Task 2',
    question: 'Some people say that the best way to improve road safety is to increase the minimum legal age for driving cars or riding motorbikes. To what extent do you agree or disagree?',
    tips: [
      'Structure your essay with an Introduction, 2 Body Paragraphs, and a Conclusion.',
      'Provide specific examples to support your arguments.',
      'Use a variety of linking words like "Furthermore", "However", and "In contrast".'
    ],
    vocabulary: ['road safety', 'minimum legal age', 'deterrence', 'accident rates', 'alternative measures']
  },
  {
    id: '2',
    type: 'Writing Task 1',
    question: 'The chart below shows the number of travelers using three different modes of transport in a specific city between 2010 and 2020. Summarize the information and make comparisons where relevant.',
    tips: [
      'Don\'t give your opinion; just report the data.',
      'Write at least 150 words.',
      'Group similar trends together.'
    ],
    vocabulary: ['steady increase', 'significant decline', 'fluctuated', 'peaked', 'remained stable']
  },
  {
    id: '3',
    type: 'Writing Task 2',
    question: 'Many people believe that it is better to learn a foreign language in the country where it is spoken. To what extent do you agree or disagree?',
    tips: [
      'Discuss both the advantages of immersion and alternatives.',
      'Maintain a neutral or formal tone.',
      'Ensure your conclusion summarizes your main points.'
    ],
    vocabulary: ['language immersion', 'cultural context', 'linguistic proficiency', 'formal education', 'native speakers']
  }
];

export interface SpeakingQuestion {
  id: string;
  part: 1 | 2 | 3;
  question: string;
}

export const SPEAKING_QUESTIONS: SpeakingQuestion[] = [
  { id: '1', part: 1, question: 'Tell me about your hometown.' },
  { id: '2', part: 1, question: 'Do you work or are you a student?' },
  { id: '3', part: 1, question: 'What do you like to do in your free time?' },
  { id: '4', part: 2, question: 'Describe a person you admire who has a positive influence on others.' },
  { id: '5', part: 3, question: 'How do you think celebrities influence young people?' },
];

export interface ReportRecord {
  key: string;
  date: string;
  type: 'Writing' | 'Speaking';
  topic: string;
  score: number;
}

export const RECENT_REPORTS: ReportRecord[] = [
  { key: '1', date: '2024-02-01', type: 'Writing', topic: 'Road Safety Essay', score: 7.5 },
  { key: '2', date: '2024-01-28', type: 'Speaking', topic: 'Hometown Interview', score: 6.5 },
  { key: '3', date: '2024-01-20', type: 'Writing', topic: 'Education in Foreign Land', score: 8.0 },
  { key: '4', date: '2024-01-15', type: 'Speaking', topic: 'Celebrity Influence', score: 7.0 },
  { key: '5', date: '2024-01-05', type: 'Writing', topic: 'Transport Modes Chart', score: 6.0 },
];

export const WRITING_PROGRESS = [
  { attempt: 1, score: 6.0 },
  { attempt: 2, score: 6.5 },
  { attempt: 3, score: 7.0 },
  { attempt: 4, score: 7.5 },
  { attempt: 5, score: 8.0 },
];




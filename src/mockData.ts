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

export interface DashboardStats {
  totalTests: number;
  bestScore: number;
  weakArea: string;
  strongSkill: string;
  weakScore: number;
  strongScore: number;
}

export interface SkillProgress {
  name: string;
  score: number;
  maxScore: number;
  color: string;
}

export interface ActivityDay {
  date: string;
  intensity: 0 | 1 | 2 | 3 | 4; // for the heatmap
}

export const DASHBOARD_STATS: DashboardStats = {
  totalTests: 0,
  bestScore: 0.0,
  weakArea: 'Listening',
  strongSkill: 'Listening',
  weakScore: 0.0,
  strongScore: 0.0,
};

export const SKILL_PROGRESS: SkillProgress[] = [
  { name: 'Listening', score: 0.0, maxScore: 9.0, color: '#A855F7' },
  { name: 'Reading', score: 0.0, maxScore: 9.0, color: '#22C55E' },
  { name: 'Writing', score: 0.0, maxScore: 9.0, color: '#3B82F6' },
  { name: 'Speaking', score: 0.0, maxScore: 9.0, color: '#EF4444' },
];

export interface SpeakingCollection {
  id: string;
  title: string;
  description: string;
  duration: string;
  attempts: number;
  recommended?: boolean;
}

export const SPEAKING_COLLECTIONS: SpeakingCollection[] = [
  {
    id: 's1',
    title: 'Personal qualities, News',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
    recommended: true,
  },
  {
    id: 's2',
    title: 'Walking, Films',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
    recommended: true,
  },
  {
    id: 's3',
    title: 'Travelling by plane, A person who has won a prize, award or medal',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
    recommended: true,
  },
  {
    id: 's4',
    title: 'Maps, Hurrying up',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
  },
  {
    id: 's5',
    title: 'Drinks, Monuments',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
  },
  {
    id: 's6',
    title: 'Reading, Cities',
    description: 'Complete IELTS Speaking test with three parts. The test will take approximately 11-14 minutes.',
    duration: '14 mins',
    attempts: 2,
  },
];

export const SPEAKING_STATS = {
  totalSubmissions: 0,
  averageScore: 0.0,
  highestScore: 0.0,
  practiceMinutes: 0,
};

export interface WritingCollection {
  id: string;
  title: string;
  description: string;
  duration: string;
  attempts: number;
  recommended?: boolean;
  type: 'Task 1' | 'Task 2' | 'Combined';
}

export const WRITING_COLLECTIONS: WritingCollection[] = [
  {
    id: 'w1',
    title: 'A public library. Flying',
    description: 'Task 1 asks you to describe charts about a public library in Little Chalfont, while Task 2 is an essay on whether the environmental benefits of flying less outweigh the disadvantages.',
    duration: '60 mins',
    attempts: 2,
    recommended: true,
    type: 'Combined',
  },
  {
    id: 'w2',
    title: 'Dance classes. Supermarkets',
    description: "The test has two tasks: in Task 1 you describe and compare charts about young people's dance classes, and in Task 2 you write an essay giving your opinion on whether buying food from all over the world is positive or negative.",
    duration: '60 mins',
    attempts: 2,
    recommended: true,
    type: 'Combined',
  },
  {
    id: 'w3',
    title: 'Activities in Melbourne. Competition at work',
    description: 'The test has two tasks: in Task 1 you describe and compare information from a graph, and in Task 2 you write an essay discussing different opinions and giving your own view.',
    duration: '60 mins',
    attempts: 2,
    recommended: true,
    type: 'Combined',
  },
  {
    id: 'w4',
    title: 'Recycling plastic bottles. Cars, buses and trucks will be driverless.',
    description: 'Task 1 asks you to explain the process of recycling plastic bottles, while Task 2 is an essay on whether the advantages of driverless vehicles outweigh the disadvantages.',
    duration: '60 mins',
    attempts: 2,
    type: 'Combined',
  },
  {
    id: 'w5',
    title: 'Airport redevelopment. Health problems',
    description: 'Task 1 asks you to describe plans showing the redevelopment of an airport, while Task 2 is an essay on whether making luxury products cheaper or focusing on basic needs is better for health.',
    duration: '60 mins',
    attempts: 2,
    type: 'Combined',
  },
  {
    id: 'w6',
    title: 'Making sugar. Advertising',
    description: 'Task 1 asks you to explain the process of making sugar from sugar cane, while Task 2 is an essay on why businesses highlight new features in advertising and whether this is a positive development.',
    duration: '60 mins',
    attempts: 2,
    type: 'Combined',
  },
];

export const WRITING_STATS = {
  totalSubmissions: 0,
  averageScore: 0.0,
  highestScore: 0.0,
  practiceMinutes: 0,
};

export const WRITING_PROGRESS = [
  { attempt: 'Jan 1', score: 6.0 },
  { attempt: 'Jan 10', score: 6.5 },
  { attempt: 'Jan 15', score: 6.5 },
  { attempt: 'Jan 22', score: 7.0 },
  { attempt: 'Jan 28', score: 7.5 },
  { attempt: 'Feb 1', score: 7.5 },
];




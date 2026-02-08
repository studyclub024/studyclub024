
export enum StudyMode {
  FLASHCARDS = 'flashcards',
  NOTES = 'notes',
  QUIZ = 'quiz',
  SUMMARY = 'summary',
  ESSAY = 'essay',
  ELI5 = 'eli5',
  DESCRIBE = 'describe',
  MATH = 'math',
  MATH_NOTES = 'math_notes',
  PLAN = 'plan',
  CHAT = 'chat',
}

export enum FlashcardTheme {
  CLASSIC = 'classic',
  GOT = 'got',
  GAME = 'game',
  HEIST = 'heist',
  JUMANJI = 'jumanji',
  POTTER = 'potter',
  LOTR = 'lotr',
  STRANGER = 'stranger',
  SPIDER = 'spider',
  IRON = 'iron',
  CAPTAIN = 'captain',
  THOR = 'thor',
  HULK = 'hulk',
  DEADPOOL = 'deadpool',
  BATMAN = 'batman',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  currency?: string; // e.g. 'INR', 'USD'
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  gradient: string;
  billingAmount?: number; // Total amount to charge in minor units (cents/paise)
}

export interface AchievementBadge {
  rank: number;
  fromRank?: number;
  userName: string;
  count: number;
  date: string;
  type: 'champion' | 'elite' | 'pro' | 'streak' | 'climb' | 'leap' | 'rank';
}

export interface DiagramElement {
  id: string;
  type: 'box' | 'circle' | 'diamond' | 'text' | 'image';
  label: string;
  x: number; // 0-100 (percentage of width)
  y: number; // 0-100 (percentage of height)
  style?: 'primary' | 'secondary' | 'accent';
  imagePrompt?: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface DiagramAnimation {
  type: 'step_reveal' | 'flow_highlight' | 'focus_pulse';
  sequence: string[];
  timing: 'slow' | 'medium' | 'fast';
}

export interface DiagramPlan {
  type: 'flow' | 'structure' | 'cycle' | 'comparison' | 'process';
  elements: DiagramElement[];
  connections: DiagramConnection[];
  animation?: DiagramAnimation;
}

export interface FlashcardItem {
  question: string;
  answer: string;
  diagram?: DiagramPlan;
  thematic_narrative?: string;
}

export interface NoteSection {
  heading: string;
  bullets: string[];
  diagram?: DiagramPlan;
}

export interface QuizMCQ {
  q: string;
  options: string[];
  answer: string;
  explanation_diagram?: DiagramPlan;
}

export interface QuizShort {
  q: string;
  answer: string;
  diagram?: DiagramPlan;
}

export interface Eli5Section {
  heading: string;
  content: string;
  bullets?: string[];
  diagram?: DiagramPlan;
}

export interface DescribeSection {
  heading: string;
  content: string;
  bullets?: string[];
  diagram?: DiagramPlan;
}

export interface MathStep {
  title: string;
  expression: string;
  explanation: string;
  diagram?: DiagramPlan;
}

export interface GraphPoint {
  x: number;
  y: number;
  label?: string;
  isImportant?: boolean; // vertex, intercept, etc.
}

export interface MathResponse {
  mode: 'math';
  equation: string;
  method_used: string;
  final_answer: string;
  final_answer_approx?: string;
  alternative_forms?: string[];
  steps: MathStep[];
  overall_diagram?: DiagramPlan;
  graph_data?: {
    type: 'linear' | 'quadratic' | 'points';
    important_points: GraphPoint[];
    plot_points: GraphPoint[]; // Points to draw the curve
    x_axis_label: string;
    y_axis_label: string;
    domain_min: number;
    domain_max: number;
    range_min: number;
    range_max: number;
  };
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  objective: string;
  resources: string[];
  tasks: string[];
}

export interface StudyPlanResponse {
  mode: 'plan';
  title: string;
  duration_days: number;
  target_goal: string;
  schedule: StudyPlanDay[];
}

export interface ChatResponse {
  mode: 'chat';
  initialMessage?: string;
}

export interface FlashcardsResponse {
  mode: 'flashcards';
  theme: FlashcardTheme;
  cards: FlashcardItem[];
}

export interface NotesResponse {
  mode: 'notes';
  title: string;
  sections: NoteSection[];
}

export interface QuizResponse {
  mode: 'quiz';
  mcq: QuizMCQ[];
  short: QuizShort[];
}

export interface SummaryResponse {
  mode: 'summary';
  bullets: string[];
  diagram?: DiagramPlan;
}

export interface EssayResponse {
  mode: 'essay';
  title: string;
  essay: string;
  diagram?: DiagramPlan;
}

export interface Eli5Response {
  mode: 'eli5';
  topic: string;
  sections: Eli5Section[];
}

export interface DescribeResponse {
  mode: 'describe';
  title: string;
  sections: DescribeSection[];
  key_insights: string[];
  images?: string[];
  captions?: string[];
}

export interface ChemReaction {
  type?: string;
  equation: string;
  description: string;
}

export interface ChemConcept {
  concept: string;
  explanation: string;
}

export interface ChemNotesResponse {
  mode: 'chem_notes';
  topic: string;
  reactions?: ChemReaction[];
  key_concepts?: ChemConcept[];
  safety?: string;
}

export interface MathDefinition {
  term: string;
  definition: string;
}

export interface MathTheorem {
  name: string;
  statement: string;
  latex?: string;
}

export interface MathFormula {
  name: string;
  latex: string;
  usage: string;
}

export interface MathExample {
  problem: string;
  solution: string;
}

export interface MathNotesResponse {
  mode: 'math_notes';
  topic: string;
  definitions?: MathDefinition[];
  theorems?: MathTheorem[];
  formulas?: MathFormula[];
  examples?: MathExample[];
  quiz?: QuizMCQ[];
}

export interface PhysicsPrinciple {
  name: string;
  description: string;
}

export interface PhysicsFormula {
  name: string;
  latex: string;
  derivation_note?: string;
}

export interface PhysicsApplication {
  context: string;
  explanation: string;
}

export interface PhysicsNotesResponse {
  mode: 'physics_notes';
  topic: string;
  principles?: PhysicsPrinciple[];
  formulas?: PhysicsFormula[];
  applications?: PhysicsApplication[];
}

export interface SpeechEvaluation {
  transcript: string;
  score: number;
  feedback: string;
  correction?: string;
}

export interface GrammarChallenge {
  tense: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface EnglishLesson {
  title: string;
  context: string;
  dialogue?: Array<{
    speaker: string;
    text: string;
    translation: string;
  }>;
  content_blocks?: Array<{
    heading?: string;
    english_text: string;
    native_text: string;
    tips?: string[];
  }>;
  vocabulary: Array<{
    word: string;
    meaning: string;
    usage: string;
  }>;
  key_phrases?: Array<{
    phrase: string;
    explanation: string;
  }>;
  grammar_focus: string;
  exam_tip?: string;
  grammar_details?: {
    tense_name?: string;
    when_to_use: string[];
    structure: {
      affirmative: string;
      negative: string;
      question: string;
    };
    examples: string[];
    real_life_usage?: string[];
    common_mistakes: Array<{
      wrong: string;
      correct: string;
    }>;
    speaking_tip: string;
  };
}

export type StudyContent =
  | FlashcardsResponse
  | NotesResponse
  | QuizResponse
  | SummaryResponse
  | EssayResponse
  | Eli5Response
  | DescribeResponse
  | MathResponse
  | ChemNotesResponse
  | MathNotesResponse
  | PhysicsNotesResponse
  | StudyPlanResponse
  | ChatResponse;

export interface SavedMaterial {
  id: string;
  timestamp: number;
  exam: string;
  mode: StudyMode | string;
  content: StudyContent;
  label: string;
}

export interface Course {
  id: string;
  title: string;
  class: string;
  subject: string;
  examType: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  isPremium: boolean;
  sections: Array<{
    id: string;
    label: string;
    content: StudyContent;
  }>;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  email?: string;
  planExpiry?: string;
  subscriptionPlanId: string;
  photoURL?: string;
  preferences: {
    flashcardTheme: FlashcardTheme;
    nativeLanguage: string;
    studyDifficulty: 'beginner' | 'intermediate' | 'expert';
  };
  stats: {
    totalGenerations: number;
    dailyGenerations: number;
    streakDays: number;
    lastActiveDate?: number;
    masteredConcepts: number;
  };
}

export interface StudyHistoryItem {
  id: string;
  timestamp: number;
  topic: string;
  mode: StudyMode;
}

import { StudyContent } from '../types';

export type Topic = {
  id: string;
  course: string;
  category: string;
  label: string;
  isPremium?: boolean;
  difficulty?: string;
  results: Record<string, StudyContent>;
};

// Base topics that were already defined
const BASE_TOPICS: Topic[] = [
  {
    id: '12-phy-ncert',
    course: 'Physics 12',
    category: 'NCERT Solutions',
    label: 'Electrostatics & Current',
    isPremium: true,
    difficulty: 'Expert',
    results: {
      notes: { mode: 'notes', title: 'Electrostatics Master', sections: [{ heading: "Coulomb's Law", bullets: ['Force between charges', 'F = k q1 q2 / r^2'] }] } as any,
      flashcards: { mode: 'flashcards', title: 'Electrostatics Flashcards', cards: [{ front: 'Coulomb\'s Law', back: 'F = k q1 q2 / r^2' }] } as any,
      quiz: { mode: 'quiz', title: 'Electrostatics Quiz', mcq: [], short: [{ q: 'What is Coulomb\'s law?', answer: 'Force between point charges proportional to product of charges' }] } as any,
      summary: { mode: 'summary', title: 'Electrostatics Summary', bullets: ['Forces between charges', 'Superposition principle'] } as any,
      eli5: { mode: 'eli5', topic: 'Electrostatics', sections: [{ heading: 'Basics', content: 'Like magnets but with electric charges.' }] } as any,
      describe: { mode: 'describe', title: 'Describe Electrostatics', sections: [{ heading: 'Overview', content: 'Electrostatics studies stationary charges.' }] } as any,
      plan: { mode: 'plan', title: 'Study Plan: Electrostatics', duration_days: 1, schedule: [{ day: 1, topic: 'Read textbook', objective: '', resources: [], tasks: ['Chapter 1', 'Exercises'] }] } as any,
    }
  },
  {
    id: '10-math-cbse',
    course: 'Maths 10',
    category: 'CBSE',
    label: 'Quadratic Equations',
    isPremium: false,
    difficulty: 'Beginner',
    results: {
      notes: { mode: 'notes', title: 'Quadratic Equations', sections: [{ heading: 'Standard Form', bullets: ['ax^2 + bx + c = 0', 'Discriminant'] }] } as any,
      flashcards: { mode: 'flashcards', title: 'Quadratic Flashcards', cards: [{ front: 'Quadratic formula', back: 'x = (-b ± sqrt(b^2-4ac))/2a' }] } as any,
      quiz: { mode: 'quiz', title: 'Quadratic Quiz', mcq: [], short: [{ q: 'Solve ax^2+bx+c=0', answer: 'Use quadratic formula' }] } as any,
      summary: { mode: 'summary', bullets: ['Quadratic formula', 'Nature of roots'] } as any,
      eli5: { mode: 'eli5', topic: 'Quadratics', sections: [{ heading: 'Idea', content: 'Equation with x^2 term.' }] } as any,
      describe: { mode: 'describe', title: 'Describe Quadratics', sections: [{ heading: 'Overview', content: 'Second-degree polynomials.' }] } as any,
      plan: { mode: 'plan', title: 'Study Plan: Quadratics', duration_days: 1, schedule: [{ day: 1, topic: 'Practice problems', objective: '', resources: [], tasks: ['Factorization', 'Formula use'] }] } as any, 
    }
  }
];

// Generate Class 10 NCERT topics for multiple subjects (20 pages each)
const SUBJECTS_10 = ['Maths', 'English', 'Hindi', 'Science', 'SocialScience'];

function makeTopicId(subject: string, index: number) {
  const s = subject.toLowerCase().replace(/[^a-z]/g, '').slice(0,4);
  return `10-${s}-${index + 1}`;
}

function makeTopic(subject: string, index: number): Topic {
  const id = makeTopicId(subject, index);
  const label = `${subject} — Topic ${index + 1}`;
  const course = `${subject} 10`;
  const results: Record<string, StudyContent> = {
    notes: { mode: 'notes', title: label, sections: [{ heading: 'Overview', bullets: [`Pre-generated notes for ${label}`] }] } as any,
    flashcards: { mode: 'flashcards', title: label + ' Flashcards', cards: [{ front: `${subject} Q${index+1}`, back: `Answer for ${subject} Q${index+1}` }] } as any,
    quiz: { mode: 'quiz', title: label + ' Quiz', mcq: [], short: [{ q: `Question about ${label}`, answer: `Answer for ${label}` }] } as any,
    summary: { mode: 'summary', title: label + ' Summary', bullets: [`Concise summary for ${label}`] } as any,
    eli5: { mode: 'eli5', topic: label, sections: [{ heading: 'Explain', content: `Simple explanation for ${label}` }] } as any,
    describe: { mode: 'describe', title: 'Describe ' + label, sections: [{ heading: 'Detail', content: `Detailed description for ${label}` }] } as any,
    plan: { mode: 'plan', title: 'Plan: ' + label, duration_days: 1, schedule: [{ day: 1, topic: 'Step 1', objective: '', resources: [], tasks: ['Read chapter', 'Practice examples'] }] } as any,
  };
  return { id, course, category: 'NCERT Solutions', label, isPremium: false, difficulty: 'Beginner', results };
}

const GENERATED_TOPICS: Topic[] = [];
SUBJECTS_10.forEach(subject => {
  for (let i = 0; i < 20; i++) {
    GENERATED_TOPICS.push(makeTopic(subject, i));
  }
});

const TOPICS: Topic[] = [...BASE_TOPICS, ...GENERATED_TOPICS];

export function getTopics() { return TOPICS.slice(); }
export function getTopicById(id: string) { return TOPICS.find(t => t.id === id) || null; }
export function addOrUpdateTopic(topic: Topic) {
  const idx = TOPICS.findIndex(t => t.id === topic.id);
  if (idx >= 0) TOPICS[idx] = topic;
  else TOPICS.push(topic);
}

export default { getTopics, getTopicById, addOrUpdateTopic };

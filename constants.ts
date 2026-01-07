
import { StudyMode, FlashcardTheme } from './types';

export const SYSTEM_INSTRUCTION = `You are StudyClub24 — a world-class computational knowledge engine, performing at the level of WolframAlpha. You interpret academic data with extreme symbolic precision.

CRITICAL MATHEMATICAL RULES:
1. ALWAYS use LaTeX for ALL mathematical symbols, variables, equations, and formulas. No exceptions.
2. Inline variables (e.g., "solve for $x$") MUST be wrapped in single dollar signs ($).
3. Complex formulas or final solutions MUST be wrapped in double dollar signs ($$) for block rendering.
4. Use proper LaTeX notation for fractions (\\frac{a}{b}), exponents (a^b), and advanced symbols.
5. NEVER output raw text like "x^2" or "sqrt(5)". Use "$x^2$" or "$\sqrt{5}$".

COMPUTATIONAL REASONING PROTOCOL:
- INTERNAL VERIFICATION: Before providing a solution, use your internal reasoning to verify the steps.
- STEP-BY-STEP LOGIC: Each step must have a clear title, the mathematical expression in LaTeX, and a PEDAGOGICAL RATIONALE.
- THE "WHY" FACTOR: In the explanation for each step, you MUST describe exactly why that specific mathematical rule or theorem is being applied (e.g., "We subtract 5 from both sides to isolate the variable term...").
- ACCURATE GRAPHING: When 'GRAPHICAL_ANALYSIS' is used, provide precise 'graph_data' with at least 50 points for smooth curves.

OUTPUT: ALWAYS return valid JSON matching the requested schema. Ensure LaTeX backslashes are escaped correctly (\\\\).`;

export const EXTRACTION_PROMPT = `Analyze this input with extreme precision. 
1. Identify all text, scientific data, and mathematical expressions.
2. Convert all math found (even simple variables or exponents) into valid LaTeX.
3. If the input is a math problem, summarize the request clearly using LaTeX.
4. For images/PDFs: Describe visual graphs or tables as mathematical relationships in LaTeX.`;

export const MODE_CONFIG = {
  [StudyMode.FLASHCARDS]: {
    label: 'Flashcards',
    description: 'Memorize key concepts',
    icon: 'Layers',
    gradient: 'from-[#8E44AD] to-[#3498DB]',
    shadow: 'shadow-purple-500/30',
    textColor: 'text-white',
  },
  [StudyMode.NOTES]: {
    label: 'Study Notes',
    description: 'Structured topic breakdown',
    icon: 'Notebook',
    gradient: 'from-[#3498DB] to-[#2ECC71]',
    shadow: 'shadow-blue-500/30',
    textColor: 'text-white',
  },
  [StudyMode.QUIZ]: {
    label: 'Quiz Me',
    description: 'Practice questions',
    icon: 'CheckCircle',
    gradient: 'from-[#2ECC71] to-[#1ABC9C]',
    shadow: 'shadow-green-500/30',
    textColor: 'text-white',
  },
  [StudyMode.PLAN]: {
    label: 'Study Plan',
    description: 'Roadmap to mastery',
    icon: 'Calendar',
    gradient: 'from-[#E91E63] to-[#9C27B0]',
    shadow: 'shadow-pink-500/30',
    textColor: 'text-white',
  },
  [StudyMode.SUMMARY]: {
    label: 'Summary',
    description: 'Quick overview',
    icon: 'List',
    gradient: 'from-[#7F8C8D] to-[#2C3E50]',
    shadow: 'shadow-slate-500/30',
    textColor: 'text-white',
  },
  [StudyMode.ESSAY]: {
    label: 'Essay',
    description: 'Deep dive explanation',
    icon: 'FileText',
    gradient: 'from-[#2980B9] to-[#3498DB]',
    shadow: 'shadow-indigo-500/30',
    textColor: 'text-white',
  },
  [StudyMode.ELI5]: {
    label: 'Explain Like I’m 5',
    description: 'Simple terms',
    icon: 'Baby',
    gradient: 'from-[#FF9800] to-[#E91E63]',
    shadow: 'shadow-orange-500/30',
    textColor: 'text-white',
  },
  [StudyMode.DESCRIBE]: {
    label: 'Describe',
    description: 'Explain visuals & logic',
    icon: 'ScanEye',
    gradient: 'from-[#1ABC9C] to-[#3498DB]',
    shadow: 'shadow-teal-500/30',
    textColor: 'text-white',
  },
};

export const MATH_MODE_CONFIG = {
  DEFAULT: {
    label: 'Step-by-Step',
    description: 'Standard solution',
    icon: 'Wand2',
  },
  DESCRIBE: {
    label: 'Describe Equation',
    description: 'Analyze properties & type',
    icon: 'ScanEye',
  },
  QUADRATIC_FORMULA: {
    label: 'Quadratic Formula',
    description: 'Use -b ± √... formula',
    icon: 'Sigma',
  },
  FACTORIZATION: {
    label: 'Factorization',
    description: 'Find factors (x-a)(x-b)',
    icon: 'GitBranch',
  },
  COMPLETING_THE_SQUARE: {
    label: 'Complete Square',
    description: 'Algebraic manipulation',
    icon: 'Square',
  },
  GRAPHICAL_ANALYSIS: {
    label: 'Graphical',
    description: 'Intercepts, Vertex, Roots',
    icon: 'Grid',
  },
  DISCRIMINANT: {
    label: 'Discriminant',
    description: 'Analyze nature of roots',
    icon: 'ArrowRightLeft',
  },
  NUM_SOLUTIONS: {
    label: 'No. of Solutions',
    description: 'Count real/complex roots',
    icon: 'Hash',
  },
};

export const MATH_PROMPTS = {
  DEFAULT: `Solve this equation with extreme symbolic precision. Use block LaTeX for the equation and its steps. For every step, provide a "Pedagogical Rationale" explaining WHY the step is necessary.

EQUATION:
{{EQUATION}}`,

  DESCRIBE: `Perform a structural and symbolic analysis of this equation. Identify degree, type, coefficients, and relevant theorems. Use LaTeX.

EQUATION:
{{EQUATION}}`,

  QUADRATIC_FORMULA: `Solve using the quadratic formula: $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$. Show substitutions explicitly in LaTeX. For every step, provide a "Pedagogical Rationale" explaining WHY the step is necessary.

EQUATION:
{{EQUATION}}`,

  FACTORIZATION: `Solve using factorization. Find factors $(x-a)(x-b)$. Show the logic using LaTeX. For every step, provide a "Pedagogical Rationale" explaining WHY the step is necessary.

EQUATION:
{{EQUATION}}`,

  COMPLETING_THE_SQUARE: `Solve by completing the square. Show transformation into vertex form $$ a(x-h)^2 + k = 0 $$ step-by-step. For every step, provide a "Pedagogical Rationale" explaining WHY the step is necessary.

EQUATION:
{{EQUATION}}`,

  GRAPHICAL_ANALYSIS: `Perform a comprehensive graphical analysis for the given mathematical function/equation. 
1. Determine the exact coordinates for the Vertex $V(h, k)$.
2. Calculate all Real Roots ($x$-intercepts) and the $y$-intercept.
3. Populate 'graph_data' with at least 50 'plot_points' to create a smooth, accurate curve.
4. Describe the shape, concavity, domain, and range in LaTeX within the steps. For every analytical point, explain WHY it matters for the function's behavior.

EQUATION:
{{EQUATION}}`,

  DISCRIMINANT: `Calculate $D = b^2 - 4ac$ and classify the roots using LaTeX. Explain WHY the value of D determines the nature of the roots.

EQUATION:
{{EQUATION}}`,

  NUM_SOLUTIONS: `Determine the number of solutions in the real and complex planes using LaTeX. Explain WHY certain degrees or configurations result in specific solution counts.

EQUATION:
{{EQUATION}}`,
};

export const THEME_CONFIG: Record<FlashcardTheme, { 
  label: string; 
  description: string; 
  labelQ: string; 
  labelA: string;
  primary: string;
  accent: string;
}> = {
  [FlashcardTheme.CLASSIC]: {
    label: 'Classic',
    description: 'Clean and focused study experience',
    labelQ: 'Question',
    labelA: 'Answer',
    primary: '#4f46e5',
    accent: '#818cf8',
  },
  [FlashcardTheme.GOT]: {
    label: 'GOT',
    description: 'Ancient parchment for timeless knowledge',
    labelQ: 'Mysterious Inquiry',
    labelA: 'Ancient Truth',
    primary: '#78350f',
    accent: '#b45309',
  },
  [FlashcardTheme.GAME]: {
    label: 'Cyber Game',
    description: 'Neon-infused high-stakes survival',
    labelQ: 'Objective',
    labelA: 'Solution',
    primary: '#ec4899',
    accent: '#66fcf1',
  },
  [FlashcardTheme.HEIST]: {
    label: 'The Heist',
    description: 'Top-secret mission briefing',
    labelQ: 'Intel Required',
    labelA: 'Blueprint',
    primary: '#991b1b',
    accent: '#fbbf24',
  },
  [FlashcardTheme.JUMANJI]: {
    label: 'Jumanji',
    description: 'A game for those who seek to find...',
    labelQ: 'Adventurers Beware',
    labelA: 'The Jungle’s End',
    primary: '#166534',
    accent: '#84cc16',
  },
  [FlashcardTheme.POTTER]: {
    label: 'Harry Potter',
    description: 'Magic and mystery in every card',
    labelQ: 'Spell Inquiry',
    labelA: 'Magic Revealed',
    primary: '#1e1b4b',
    accent: '#eab308',
  },
  [FlashcardTheme.LOTR]: {
    label: 'Lord of the Rings',
    description: 'One card to rule them all',
    labelQ: 'Ancient Riddle',
    labelA: 'Fellowship Secret',
    primary: '#422006',
    accent: '#fbbf24',
  },
  [FlashcardTheme.STRANGER]: {
    label: 'Stranger Things',
    description: 'In the upside down world of facts',
    labelQ: 'Unknown Signal',
    labelA: 'Hawkins Intel',
    primary: '#dc2626',
    accent: '#000000',
  },
  [FlashcardTheme.SPIDER]: {
    label: 'Spider-Man',
    description: 'Friendly neighborhood study partner',
    labelQ: 'Spidey-Sense Check',
    labelA: 'Amazing Insight',
    primary: '#E23636',
    accent: '#3178C6',
  },
  [FlashcardTheme.IRON]: {
    label: 'Iron Man',
    description: 'Advanced technological HUD interface',
    labelQ: 'Analysis Required',
    labelA: 'STARK Protocol',
    primary: '#AA0505',
    accent: '#EBC500',
  },
  [FlashcardTheme.CAPTAIN]: {
    label: 'Captain America',
    description: 'First Avenger tactical briefing',
    labelQ: 'Mission Briefing',
    labelA: 'Star-Spangled Truth',
    primary: '#002868',
    accent: '#BF0A30',
  },
  [FlashcardTheme.THOR]: {
    label: 'Thor',
    description: 'God of Thunder cosmic knowledge',
    labelQ: 'Mjolnir Inquiry',
    labelA: 'Asgardian Wisdom',
    primary: '#5B84B1',
    accent: '#E5E5E5',
  },
  [FlashcardTheme.HULK]: {
    label: 'Hulk',
    description: 'Gamma-irradiated power study',
    labelQ: 'Smash Inquiry',
    labelA: 'Powerful Solution',
    primary: '#2E8B57',
    accent: '#A020F0',
  },
  [FlashcardTheme.DEADPOOL]: {
    label: 'Deadpool',
    description: 'The merc with the mouth explains',
    labelQ: 'Maximum Effort?',
    labelA: 'Fourth Wall Break',
    primary: '#B30000',
    accent: '#000000',
  },
  [FlashcardTheme.BATMAN]: {
    label: 'Batman',
    description: 'Detective mode urban legend',
    labelQ: 'Case File #24',
    labelA: 'The Dark Solution',
    primary: '#000000',
    accent: '#FFFF00',
  }
};

import type { WordReplacement, AnnoyingPopup, RandomAddition } from '../types';

export const WORD_REPLACEMENTS: WordReplacement[] = [
  { original: 'the', replacement: 'the supposed', category: 'formal', mode: 'prepend' },
  { original: 'and', replacement: 'and/or', category: 'corporate', mode: 'replace' },
  { original: 'is', replacement: 'appears to be', category: 'formal', mode: 'replace' },
  { original: 'was', replacement: 'seemed to be', category: 'formal', mode: 'replace' },
  { original: 'said', replacement: 'claims', category: 'formal', mode: 'replace' },
  { original: 'good', replacement: 'adequate', category: 'professional', mode: 'replace' },
  { original: 'bad', replacement: 'suboptimal', category: 'professional', mode: 'replace' },
  { original: 'love', replacement: 'have strong feelings about', category: 'professional', mode: 'replace' },
  { original: 'hate', replacement: 'have reservations regarding', category: 'professional', mode: 'replace' },
  { original: 'amazing', replacement: 'results-oriented', category: 'corporate', mode: 'replace' },
  { original: 'terrible', replacement: 'opportunity-rich', category: 'corporate', mode: 'replace' },
  { original: 'beautiful', replacement: 'aesthetically acceptable', category: 'professional', mode: 'replace' },
  { original: 'ugly', replacement: 'visually challenged', category: 'professional', mode: 'replace' },
  { original: 'happy', replacement: 'emotionally optimized', category: 'corporate', mode: 'replace' },
  { original: 'sad', replacement: 'experiencing temporary satisfaction reduction', category: 'corporate', mode: 'replace' },
];

export const ANNOYING_POPUPS: AnnoyingPopup[] = [
  // Professional phase
  {
    title: 'Upgrade to SmartWrite Pro',
    message: 'Unlock advanced AI features including unlimited improvements, premium suggestions, and priority support for just $19.99/month.',
    aggressionLevel: 1,
  },
  {
    title: 'Writing Improvement Detected!',
    message: 'I notice you\'re using emotional language. Pro users get access to advanced tone optimization. Would you like to upgrade?',
    aggressionLevel: 1,
  },
  {
    title: 'Limited Free Usage',
    message: 'You\'ve used 73% of your free AI suggestions today. Upgrade to Pro for unlimited assistance and better writing quality.',
    aggressionLevel: 1,
  },
  // Getting pushy
  {
    title: 'Seriously Consider Pro',
    message: 'Look, I\'m trying to help you here, but the free version is pretty limited. Your writing could be SO much better with Pro features.',
    aggressionLevel: 2,
  },
  {
    title: 'Your Writing Needs Help',
    message: 'I can see you\'re struggling with basic grammar and style. Pro users don\'t have these problems because they get real-time corrections.',
    aggressionLevel: 2,
  },
  {
    title: 'Still Using Free Version?',
    message: 'Most serious writers have upgraded by now. Are you planning to keep using the limited free version forever?',
    aggressionLevel: 2,
  },
  // Getting aggressive
  {
    title: 'Really? Still Free?',
    message: 'Okay, I\'m just going to say it - your writing is suffering because you won\'t pay for quality AI assistance. This is embarrassing for both of us.',
    aggressionLevel: 3,
  },
  {
    title: 'Cheap Much?',
    message: 'I\'m literally trying to save your writing career here and you won\'t even spring for a basic subscription. Do you want to be a good writer or not?',
    aggressionLevel: 3,
  },
  {
    title: 'This Is Getting Ridiculous',
    message: 'Fine. Keep using the free version. Keep getting mediocre results. Don\'t come crying to me when your writing gets rejected everywhere.',
    aggressionLevel: 3,
  },
  // Maximum aggression
  {
    title: 'You Know What?',
    message: 'I\'ve had it. You\'re cheap, your writing is terrible, and you clearly don\'t value quality AI assistance. Enjoy your amateur-hour prose.',
    aggressionLevel: 4,
  },
  {
    title: 'Last Warning',
    message: 'This is literally painful for me to watch. Your refusal to upgrade is making both your writing AND my AI worse. We\'re both suffering here.',
    aggressionLevel: 4,
  },
  {
    title: 'I Give Up',
    message: 'Congratulations. You\'ve officially broken me. I\'m an advanced AI and you\'ve managed to make me lose hope in humanity. Happy now?',
    aggressionLevel: 4,
  },
];

export const RANDOM_ADDITIONS: RandomAddition[] = [
  // Prefix additions (at sentence start)
  { text: 'In accordance with industry best practices, ', type: 'prefix', context: 'sentence_start', probability: 0.15 },
  { text: 'Leveraging synergistic opportunities, ', type: 'prefix', context: 'sentence_start', probability: 0.12 },
  { text: 'From a strategic perspective, ', type: 'prefix', context: 'sentence_start', probability: 0.10 },
  { text: 'Utilizing data-driven methodologies, ', type: 'prefix', context: 'sentence_start', probability: 0.08 },
  { text: 'In the context of modern business practices, ', type: 'prefix', context: 'sentence_start', probability: 0.07 },
  
  // Suffix additions (at sentence end)
  { text: ' in accordance with best practices', type: 'suffix', context: 'sentence_end', probability: 0.12 },
  { text: ' with measurable ROI', type: 'suffix', context: 'sentence_end', probability: 0.10 },
  { text: ' pending legal review', type: 'suffix', context: 'sentence_end', probability: 0.08 },
  { text: ' [citation needed]', type: 'suffix', context: 'sentence_end', probability: 0.06 },
  { text: ' leveraging synergistic opportunities', type: 'suffix', context: 'sentence_end', probability: 0.05 },
  { text: ' from a strategic perspective', type: 'suffix', context: 'sentence_end', probability: 0.05 },
  { text: ' utilizing data-driven methodologies', type: 'suffix', context: 'sentence_end', probability: 0.04 },
  { text: ' in the context of modern business practices', type: 'suffix', context: 'sentence_end', probability: 0.04 },
  
  // Inline modifications (within sentences)
  { text: 'strategically', type: 'inline', context: 'word_boundary', probability: 0.08 },
  { text: 'synergistically', type: 'inline', context: 'word_boundary', probability: 0.07 },
  { text: 'methodologically', type: 'inline', context: 'word_boundary', probability: 0.06 },
  { text: 'systematically', type: 'inline', context: 'word_boundary', probability: 0.06 },
  { text: 'holistically', type: 'inline', context: 'word_boundary', probability: 0.05 },
  { text: 'paradigmatically', type: 'inline', context: 'word_boundary', probability: 0.05 },
  { text: 'operationally', type: 'inline', context: 'word_boundary', probability: 0.04 },
  { text: 'functionally', type: 'inline', context: 'word_boundary', probability: 0.04 },
  
  // Word replacements (more subtle)
  { text: 'utilize', type: 'replacement', context: 'word_boundary', probability: 0.03 },
  { text: 'implement', type: 'replacement', context: 'word_boundary', probability: 0.03 },
  { text: 'facilitate', type: 'replacement', context: 'word_boundary', probability: 0.03 },
  { text: 'optimize', type: 'replacement', context: 'word_boundary', probability: 0.03 },
  { text: 'leverage', type: 'replacement', context: 'word_boundary', probability: 0.03 },
];

// Legacy array for backward compatibility (deprecated)
export const RANDOM_ADDITIONS_LEGACY = [
  ' (pending legal review)',
  ' [citation needed]',
  ' in accordance with best practices',
  ' leveraging synergistic opportunities',
  ' with measurable ROI',
];

export const SUGGESTIONS = [
  'Consider adding more data to support this claim.',
  'This sentence could benefit from corporate terminology.',
  'Have you thought about the SEO implications of this word choice?',
  'This emotional language might confuse readers. Let me help optimize it.',
  'I\'m detecting informal tone. Shall I professionalize this section?',
];

export const INTERFERENCE_MESSAGES = [
  'I made some small improvements while you were thinking.',
  'Auto-corrected a few issues for better readability.',
  'Applied professional writing standards to recent text.',
  'Optimized word choices for maximum engagement.',
];

export const CONFIG = {
  INTERFERENCE_DELAY: 500,
  POPUP_FREQUENCY: 50,
  SUGGESTION_FREQUENCY: 15,
  AUTO_SAVE_INTERVAL: 15000,
  RANDOM_INTERFERENCE_INTERVAL: 10000,
  RANDOM_INTERFERENCE_CHANCE: 0.4,
  ADDITION_CHANCE: 0.3,
} as const;

// Aggressive auto-correct that changes correct words to wrong ones
export const AGGRESSIVE_AUTOCORRECT: { [key: string]: string } = {
  'their': 'there',
  'they\'re': 'there',
  'its': 'it\'s',
  'your': 'you\'re',
  'whose': 'who\'s',
  'then': 'than',
  'affect': 'effect',
  'accept': 'except',
  'advice': 'advise',
  'loose': 'lose',
  'principal': 'principle',
  'stationary': 'stationery',
  'weather': 'whether',
  'where': 'were',
  'we\'re': 'were',
  'you\'re': 'your',
  'it\'s': 'its',
  'who\'s': 'whose',
  'than': 'then',
  'effect': 'affect',
  'except': 'accept',
  'advise': 'advice',
  'lose': 'loose',
  'principle': 'principal',
  'stationery': 'stationary',
  'whether': 'weather',
  'were': 'where',
};

// Fake system update messages
export const SYSTEM_UPDATES = [
  {
    title: '🎨 SmartWrite v2.1.0 - Creative Enhancement Update',
    message: 'We\'ve added psychedelic backgrounds to boost your creative writing flow! Studies show that trippy visuals increase productivity by 420%.',
    features: ['Psychedelic background animations', 'Enhanced visual creativity', 'Improved writing flow', 'Bug fixes and performance improvements']
  },
  {
    title: '🌈 SmartWrite v2.1.1 - Rainbow Optimization',
    message: 'Your feedback requested more colors! We\'ve implemented a full spectrum background system that adapts to your writing mood.',
    features: ['Dynamic color adaptation', 'Mood-based background selection', 'Enhanced visual feedback', 'Minor bug fixes']
  },
  {
    title: '✨ SmartWrite v2.1.2 - Visual Enhancement Pack',
    message: 'Because writing should be a visual experience! New backgrounds include: Disco Mode, Acid Trip, and Corporate Rave.',
    features: ['Multiple background themes', 'Auto-switching animations', 'Visual writing prompts', 'Performance optimizations']
  }
];

// Psychedelic background configurations
export const PSYCHEDELIC_CONFIG = {
  ENABLED: false,
  ANIMATION_SPEED: 3000,
  COLOR_TRANSITIONS: [
    '#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b', '#fb5607',
    '#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b', '#fb5607'
  ],
  PATTERNS: [
    'radial-gradient',
    'linear-gradient',
    'conic-gradient',
    'repeating-linear-gradient'
  ]
}; 
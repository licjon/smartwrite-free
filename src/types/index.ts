export interface WritingStats {
  wordCount: number;
  charCount: number;
  improvementCount: number;
  engagementScore: number;
}

export interface Suggestion {
  id: string;
  text: string;
  timestamp: Date;
  type: 'improvement' | 'notification' | 'popup';
}

export interface PopupData {
  title: string;
  message: string;
  type: 'upgrade' | 'improvement' | 'notification';
}

export interface WordReplacement {
  original: string;
  replacement: string;
  category: 'professional' | 'corporate' | 'formal';
  mode?: 'replace' | 'prepend' | 'append';
}

export interface AnnoyingPopup {
  title: string;
  message: string;
  aggressionLevel: number;
}

export interface RandomAddition {
  text: string;
  type: 'prefix' | 'suffix' | 'inline' | 'replacement';
  context?: 'sentence_start' | 'sentence_end' | 'word_boundary' | 'anywhere';
  probability: number;
} 
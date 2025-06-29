import type { RandomAddition } from '../types';

export function calculateWordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function calculateCharCount(text: string): number {
  return text.length;
}

export function calculateEngagementScore(improvementCount: number): number {
  return Math.min(improvementCount * 12, 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function findSentenceBoundaries(text: string): { starts: number[], ends: number[] } {
  const starts: number[] = [];
  const ends: number[] = [];
  
  // Find sentence starts (after periods, exclamation marks, question marks)
  const sentenceStartRegex = /[.!?]\s+[A-Z]/g;
  let match;
  while ((match = sentenceStartRegex.exec(text)) !== null) {
    starts.push(match.index + match[0].length - 1); // Position of the capital letter
  }
  
  // Add the start of the text if it doesn't start with a sentence
  if (text.length > 0 && !starts.includes(0)) {
    starts.unshift(0);
  }
  
  // Find sentence ends
  const sentenceEndRegex = /[.!?](?=\s|$)/g;
  while ((match = sentenceEndRegex.exec(text)) !== null) {
    ends.push(match.index + 1);
  }
  
  return { starts, ends };
}

export function selectRandomAddition(additions: RandomAddition[]): RandomAddition | null {
  const totalProbability = additions.reduce((sum, addition) => sum + addition.probability, 0);
  const random = Math.random() * totalProbability;
  
  let cumulativeProbability = 0;
  for (const addition of additions) {
    cumulativeProbability += addition.probability;
    if (random <= cumulativeProbability) {
      return addition;
    }
  }
  
  return null;
}

export function applyPrefixAddition(text: string, addition: RandomAddition): string {
  const { starts } = findSentenceBoundaries(text);
  if (starts.length === 0) return text;
  
  // Pick a random sentence start (but not the very beginning if it's the only sentence)
  const startIndex = starts.length > 1 ? starts[Math.floor(Math.random() * starts.length)] : starts[0];
  
  return text.slice(0, startIndex) + addition.text + text.slice(startIndex);
}

export function applySuffixAddition(text: string, addition: RandomAddition): string {
  const { ends } = findSentenceBoundaries(text);
  if (ends.length === 0) return text;
  
  // Pick a random sentence end
  const endIndex = ends[Math.floor(Math.random() * ends.length)];
  
  return text.slice(0, endIndex) + addition.text + text.slice(endIndex);
}

export function applyInlineAddition(text: string, addition: RandomAddition): string {
  const words = text.split(/\s+/);
  if (words.length < 3) return text;
  
  // Find a good position to insert (not at the beginning or end)
  const insertIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
  
  words.splice(insertIndex, 0, addition.text);
  return words.join(' ');
}

export function applyReplacementAddition(text: string, addition: RandomAddition): string {
  // Find common words to replace
  const commonWords = ['use', 'make', 'do', 'get', 'have', 'take', 'give', 'find', 'think', 'know'];
  const wordToReplace = commonWords[Math.floor(Math.random() * commonWords.length)];
  
  const regex = new RegExp(`\\b${wordToReplace}\\b`, 'gi');
  if (text.match(regex)) {
    return text.replace(regex, addition.text);
  }
  
  return text;
}

export function applyRandomAddition(text: string, additions: RandomAddition[]): { text: string, applied: boolean } {
  if (text.length < 20) return { text, applied: false };
  
  const addition = selectRandomAddition(additions);
  if (!addition) return { text, applied: false };
  
  let modifiedText = text;
  
  switch (addition.type) {
    case 'prefix':
      modifiedText = applyPrefixAddition(text, addition);
      break;
    case 'suffix':
      modifiedText = applySuffixAddition(text, addition);
      break;
    case 'inline':
      modifiedText = applyInlineAddition(text, addition);
      break;
    case 'replacement':
      modifiedText = applyReplacementAddition(text, addition);
      break;
  }
  
  return { text: modifiedText, applied: modifiedText !== text };
} 
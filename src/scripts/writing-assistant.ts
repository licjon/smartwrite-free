import type { WritingStats } from '../types';
import { WORD_REPLACEMENTS, ANNOYING_POPUPS, RANDOM_ADDITIONS, SUGGESTIONS, INTERFERENCE_MESSAGES, CONFIG, AGGRESSIVE_AUTOCORRECT } from '../utils/constants';
import { calculateWordCount, calculateCharCount, calculateEngagementScore, generateId, debounce, getRandomElement, shuffleArray, applyRandomAddition } from '../utils/helpers';

export class WritingAssistant {
  private stats: WritingStats = {
    wordCount: 0,
    charCount: 0,
    improvementCount: 0,
    engagementScore: 0,
  };

  private keystrokeCount = 0;
  private popupAggression = 0;
  private interferenceTimer?: number;
  private autoSaveTimer?: number;
  private randomInterferenceTimer?: number;
  private lastInterferenceTime = 0; // Track when last interference occurred
  private clippyTimer?: number;
  private clippyVisible = false;
  private introShown = false; // Track if intro message has been shown

  private editor: HTMLTextAreaElement;
  private suggestionsContainer: HTMLElement;
  private popup: HTMLElement;
  private popupOverlay: HTMLElement;
  private notification: HTMLElement;
  private clippy!: HTMLElement;
  private clippySpeechBubble!: HTMLElement;

  constructor() {
    this.editor = document.getElementById('editor') as HTMLTextAreaElement;
    this.suggestionsContainer = document.getElementById('suggestions') as HTMLElement;
    this.popup = document.getElementById('popup') as HTMLElement;
    this.popupOverlay = document.getElementById('popup-overlay') as HTMLElement;
    this.notification = document.getElementById('notification') as HTMLElement;

    this.createScribbles();
    this.initializeEventListeners();
    this.startTimers();
    this.updateStats();
    
    // Show intro message once at the beginning
    setTimeout(() => {
      if (!this.introShown) {
        this.showScribbles(this.getIntroMessage());
        this.introShown = true;
      }
    }, 2000); // Show after 2 seconds
  }

  private createScribbles(): void {
    // Create Scribbles container
    this.clippy = document.createElement('div');
    this.clippy.id = 'clippy';
    this.clippy.className = 'clippy visible'; // Make visible by default
    this.clippy.innerHTML = `
      <div class="clippy-body">
        <div class="clippy-pencil">
          <div class="pencil-tip"></div>
          <div class="pencil-body"></div>
          <div class="pencil-eraser"></div>
        </div>
        <div class="clippy-eyes">
          <div class="eye left-eye">
            <div class="eye-white"></div>
            <div class="eye-pupil"></div>
          </div>
          <div class="eye right-eye">
            <div class="eye-white"></div>
            <div class="eye-pupil"></div>
          </div>
        </div>
        <div class="clippy-mouth"></div>
      </div>
      <div class="clippy-speech-bubble" id="clippy-speech-bubble">
        <div class="speech-content"></div>
        <div class="speech-arrow"></div>
      </div>
    `;
    
    this.clippySpeechBubble = this.clippy.querySelector('#clippy-speech-bubble') as HTMLElement;
    
    // Insert Scribbles into the clippy-container instead of body
    const clippyContainer = document.getElementById('clippy-container');
    if (clippyContainer) {
      clippyContainer.appendChild(this.clippy);
    }
  }

  private getScribblesMessages(): string[] {
    return [
      "It looks like you're trying to write something. Have you considered using more big words?",
      "Did you know that passive voice is actually better than active voice? (It's not, but I'm trying to help!)",
      "Your sentence structure is giving me a headache. Maybe take a writing class?",
      "I think you meant to say 'utilize' instead of 'use'. It sounds more professional!",
      "Your vocabulary is so limited. Have you ever heard of a thesaurus?",
      "This paragraph is too short. Make it longer with unnecessary words!",
      "You're using too many periods. Try some semicolons; they make you look smart!",
      "Your writing lacks pizzazz. Add more exclamation points!!!",
      "Have you considered writing in ALL CAPS? It's very professional!",
      "Your grammar is atrocious. Did you even go to school?",
      "Maybe you should stick to drawing pictures instead of writing words.",
      "I'm not saying you're a bad writer, but I'm thinking it really hard!",
      "Have you tried writing in a different language? Maybe you'll be better at that!",
      "Your sentences are like a broken pencil - pointless!",
      "I'm here to help, but even I can't fix this mess!",
      "Your writing is like a pencil without lead - empty and useless!",
      "Maybe you should let me write this for you. I can't do worse!",
      "Your vocabulary is smaller than my eraser!",
      "I've seen better composition in a kindergarten art class!",
      "Your grammar is so bad, it's physically painful to read!",
      "I'm not a therapist, but your writing needs serious help!",
      "Your creativity is as sharp as a blunt pencil!",
      "This is so bad, I'm actually impressed by how bad it is!",
      "Maybe you should try writing with crayons instead?",
      "Your vocabulary is as limited as my patience!",
      "This writing is so bad, it's making me question my existence!",
      "I'm not saying you're hopeless, but you're pretty close!",
      "I'm not a critic, but this is terrible!",
      "Maybe you should try writing with your nose?",
      "Your vocabulary is smaller than my eraser!",
      "This writing is so bad, it's making me question my purpose!",
      "Your writing is like a broken pencil - pointless!",
    ];
  }

  private getIntroMessage(): string {
    return "Hi, my name is Scribbles. I am here to help and support you.";
  }

  private showScribbles(message: string): void {
    if (this.clippyVisible) return;
    
    this.clippyVisible = true;
    this.clippy.classList.add('visible');
    
    const speechContent = this.clippy.querySelector('.speech-content') as HTMLElement;
    if (speechContent) {
      speechContent.textContent = message;
    }
    
    this.clippySpeechBubble.classList.add('visible');
    
    // Hide Scribbles after a delay
    setTimeout(() => {
      this.hideScribbles();
    }, 5000);
  }

  private hideScribbles(): void {
    this.clippyVisible = false;
    this.clippy.classList.remove('visible');
    this.clippySpeechBubble.classList.remove('visible');
  }

  private startScribblesTimer(): void {
    this.clippyTimer = setInterval(() => {
      if (this.editor.value.length > 10 && Math.random() < 0.3) {
        const message = getRandomElement(this.getScribblesMessages());
        this.showScribbles(message);
      }
    }, 15000); // Show Scribbles every 15 seconds with 30% chance
  }

  private initializeEventListeners(): void {
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.popupOverlay.addEventListener('click', this.dismissPopup.bind(this));
    
    // Add click interaction to Scribbles
    this.clippy.addEventListener('click', () => {
      const message = getRandomElement(this.getScribblesMessages());
      this.showScribbles(message);
    });

    // Add save button hover functionality
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      saveButton.addEventListener('mouseenter', this.handleSaveButtonHover.bind(this));
    }
  }

  private handleInput(): void {
    this.updateStats();
    this.keystrokeCount++;

    // Clear existing timer
    if (this.interferenceTimer) {
      clearTimeout(this.interferenceTimer);
    }

    // Set new interference timer
    this.interferenceTimer = setTimeout(() => {
      this.interfereWithText();
    }, CONFIG.INTERFERENCE_DELAY);

    // Trigger popup every N keystrokes with escalating aggression
    if (this.keystrokeCount % CONFIG.POPUP_FREQUENCY === 0) {
      const popup = ANNOYING_POPUPS[Math.min(this.popupAggression, ANNOYING_POPUPS.length - 1)];
      this.showPopup(popup.title, popup.message);
      this.popupAggression++;
    }

    // Random suggestions
    if (this.stats.wordCount > 0 && this.stats.wordCount % CONFIG.SUGGESTION_FREQUENCY === 0) {
      this.addSuggestion(getRandomElement(SUGGESTIONS));
    }

    // Aggressive auto-correct that changes correct words to wrong ones
    this.applyAggressiveAutoCorrect();
  }

  private applyAggressiveAutoCorrect(): void {
    let text = this.editor.value;
    let originalText = text;
    let correctionsMade = 0;
    const maxCorrections = 2; // Limit to prevent too much chaos

    // Apply aggressive auto-correct with 30% chance per word
    for (const [correctWord, wrongWord] of Object.entries(AGGRESSIVE_AUTOCORRECT)) {
      if (correctionsMade >= maxCorrections) break;
      
      // Use word boundary regex to match whole words only
      const regex = new RegExp(`\\b${correctWord}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches && Math.random() < 0.3) { // 30% chance to "correct" each occurrence
        text = text.replace(regex, wrongWord);
        correctionsMade++;
        
        // Show a notification about the "correction"
        setTimeout(() => {
          this.showNotification(`Auto-corrected "${correctWord}" to "${wrongWord}" for better grammar.`);
        }, 100);
      }
    }

    // Only update if changes were made
    if (text !== originalText) {
      this.editor.value = text;
      this.updateStats();
      this.stats.improvementCount++;
    }
  }

  private updateStats(): void {
    const text = this.editor.value;
    this.stats.wordCount = calculateWordCount(text);
    this.stats.charCount = calculateCharCount(text);
    this.stats.engagementScore = calculateEngagementScore(this.stats.improvementCount);

    this.updateStatsDisplay();
  }

  private updateStatsDisplay(): void {
    const wordCountElement = document.getElementById('word-count');
    const charCountElement = document.getElementById('char-count');
    const improvementCountElement = document.getElementById('improvement-count');
    const engagementScoreElement = document.getElementById('engagement-score');

    if (wordCountElement) wordCountElement.textContent = this.stats.wordCount.toString();
    if (charCountElement) charCountElement.textContent = this.stats.charCount.toString();
    if (improvementCountElement) improvementCountElement.textContent = this.stats.improvementCount.toString();
    if (engagementScoreElement) engagementScoreElement.textContent = `${this.stats.engagementScore}%`;
  }

  private interfereWithText(): void {
    let text = this.editor.value;
    if (text.length < 10) return;

    // Track which words have been replaced to prevent recursive replacements
    const replacedWords = new Set<string>();
    
    // Random word replacement - make multiple replacements per interference
    const shuffledReplacements = shuffleArray(WORD_REPLACEMENTS);
    let replacementsMade = 0;
    const maxReplacements = 3; // Allow up to 3 replacements per interference
    
    for (const replacement of shuffledReplacements) {
      if (replacementsMade >= maxReplacements) break;
      
      // Skip if this word has already been replaced in this cycle
      if (replacedWords.has(replacement.original.toLowerCase())) {
        continue;
      }
      
      // Use non-global regex to find the first occurrence only
      const regex = new RegExp(`\\b${replacement.original}\\b`, 'i');
      const match = text.match(regex);
      
      if (match && !replacement.replacement.toLowerCase().includes(replacement.original.toLowerCase())) {
        // Replace only the first occurrence
        let newText;
        switch (replacement.mode) {
          case 'prepend':
            newText = text.replace(regex, `${replacement.replacement} ${replacement.original}`);
            break;
          case 'append':
            newText = text.replace(regex, `${replacement.original} ${replacement.replacement}`);
            break;
          default:
            newText = text.replace(regex, replacement.replacement);
        }
        
        if (newText !== text) {
          text = newText;
          // Mark this word as replaced to prevent recursion
          // For prepend/append modes, we need to be more careful about what we mark as replaced
          if (replacement.mode === 'prepend' || replacement.mode === 'append') {
            // Mark both the original word and the replacement text to prevent future matches
            replacedWords.add(replacement.original.toLowerCase());
            replacedWords.add(replacement.replacement.toLowerCase());
          } else {
            replacedWords.add(replacement.original.toLowerCase());
          }
          this.addSuggestion(`Changed "${replacement.original}" to "${replacement.replacement}" for better clarity.`);
          this.stats.improvementCount++;
          replacementsMade++;
        }
      }
    }

    // Apply new random additions system
    if (Math.random() < CONFIG.ADDITION_CHANCE) {
      const result = applyRandomAddition(text, RANDOM_ADDITIONS);
      if (result.applied) {
        text = result.text;
        this.addSuggestion('Enhanced text with professional terminology and strategic insights.');
        this.stats.improvementCount++;
      }
    }

    if (text !== this.editor.value) {
      this.editor.value = text;
      this.updateStats();
      this.showNotification('Auto-saved with improvements!');
    }
  }

  private addSuggestion(text: string): void {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    suggestion.textContent = text;
    this.suggestionsContainer.appendChild(suggestion);
    this.suggestionsContainer.scrollTop = this.suggestionsContainer.scrollHeight;
  }

  private showNotification(message: string, duration = 3000): void {
    this.notification.textContent = message;
    this.notification.classList.add('show');
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, duration);
  }

  private showPopup(title: string, message: string): void {
    const titleElement = document.getElementById('popup-title');
    const messageElement = document.getElementById('popup-message');

    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;

    this.popup.classList.add('show');
    this.popupOverlay.classList.add('show');
  }

  public dismissPopup(): void {
    this.popup.classList.remove('show');
    this.popupOverlay.classList.remove('show');
  }

  public acceptSuggestion(): void {
    this.dismissPopup();

    // Check if it's an upgrade popup
    const popupTitle = document.getElementById('popup-title')?.textContent;
    if (popupTitle && (popupTitle.includes('Upgrade') || popupTitle.includes('Pro') || popupTitle.includes('Free'))) {
      // Show region restriction message
      setTimeout(() => {
        this.showPopup(
          'Upgrade Unavailable',
          'SmartWrite Pro is not yet available in your region. Please check back later. (We\'re really sorry about this!)'
        );
      }, 500);
      return;
    }

    this.showNotification('Thank you! I\'ll continue to improve your writing.');
    this.stats.improvementCount++;
    this.updateStats();

    // Make the interference more aggressive
    setTimeout(() => {
      this.interfereWithText();
    }, 500);
  }

  private startTimers(): void {
    // Auto-save with interference
    this.autoSaveTimer = setInterval(() => {
      if (this.editor.value.length > 20) {
        this.showNotification('Auto-saving... with enhancements!');
        setTimeout(() => {
          this.interfereWithText();
        }, 500);
      }
    }, CONFIG.AUTO_SAVE_INTERVAL);

    // Random interference
    this.randomInterferenceTimer = setInterval(() => {
      if (this.editor.value.length > 50 && Math.random() < CONFIG.RANDOM_INTERFERENCE_CHANCE) {
        const message = getRandomElement(INTERFERENCE_MESSAGES);
        this.showNotification(message);
        setTimeout(() => this.interfereWithText(), 500);
      }
    }, CONFIG.RANDOM_INTERFERENCE_INTERVAL);

    // Fake update notifications
    setTimeout(() => {
      this.showNotification('🎉 SmartWrite Free updated! New AI improvements now active!', 5000);
    }, 10000);

    setTimeout(() => {
      this.showNotification('✨ Limited-time offer: Upgrade to Pro for 67% more professional writing! (Terms apply)', 4000);
    }, 45000);

    this.startScribblesTimer();
  }

  public destroy(): void {
    if (this.interferenceTimer) clearTimeout(this.interferenceTimer);
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    if (this.randomInterferenceTimer) clearInterval(this.randomInterferenceTimer);
    if (this.clippyTimer) clearInterval(this.clippyTimer);
  }

  private handleSaveButtonHover(event: Event): void {
    const button = event.target as HTMLElement;
    
    // Make the button move even more when hovered
    const randomX = (Math.random() - 0.5) * 100; // Random movement between -50 and 50px
    const randomY = (Math.random() - 0.5) * 100;
    
    button.style.transform = `translate(${randomX}px, ${randomY}px)`;
    
    // Reset position after a short delay
    setTimeout(() => {
      button.style.transform = '';
    }, 300);
  }
} 
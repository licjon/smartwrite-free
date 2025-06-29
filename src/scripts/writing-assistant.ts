import type { WritingStats } from '../types';
import { WORD_REPLACEMENTS, ANNOYING_POPUPS, RANDOM_ADDITIONS, SUGGESTIONS, INTERFERENCE_MESSAGES, CONFIG, AGGRESSIVE_AUTOCORRECT, SYSTEM_UPDATES, PSYCHEDELIC_CONFIG } from '../utils/constants';
import { calculateWordCount, calculateCharCount, calculateEngagementScore, getRandomElement, shuffleArray, applyRandomAddition } from '../utils/helpers';

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
  private clippyTimer?: number;
  private clippyVisible = false;
  private introShown = false; // Track if intro message has been shown
  private psychedelicEnabled = false;
  private psychedelicTimer?: number;
  private currentColorIndex = 0;
  private systemUpdateShown = false;
  private modeCycleTimer?: number;
  private currentMode = 'normal'; // 'normal', 'psychedelic', 'dull'

  private editor: HTMLTextAreaElement;
  private suggestionsContainer: HTMLElement;
  private popup: HTMLElement;
  private popupOverlay: HTMLElement;
  private notification: HTMLElement;
  private clippy!: HTMLElement;
  private clippySpeechBubble!: HTMLElement;
  private body: HTMLElement;

  constructor() {
    this.editor = document.getElementById('editor') as HTMLTextAreaElement;
    this.suggestionsContainer = document.getElementById('suggestions') as HTMLElement;
    this.popup = document.getElementById('popup') as HTMLElement;
    this.popupOverlay = document.getElementById('popup-overlay') as HTMLElement;
    this.notification = document.getElementById('notification') as HTMLElement;
    this.body = document.body;

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

    // Start mode cycling after 15 seconds
    setTimeout(() => {
      this.startModeCycling();
    }, 15000);

    // System update will now be triggered when word count reaches 30
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
      // Psychedelic messages (when psychedelic mode is active)
      "Whoa, dude! The colors are totally helping your writing flow!",
      "I can see the words dancing on the screen! Groovy!",
      "Your creativity is flowing like a rainbow river!",
      "The universe is speaking through your keyboard!",
      "I'm tripping on your sentence structure, man!",
      "The colors are telling me you need more exclamation points!!!",
      "I can feel the cosmic energy in your prose!",
      "Your words are like butterflies in a kaleidoscope!",
      "The matrix is speaking through your fingertips!",
      "I'm seeing patterns in your writing that transcend reality!",
      "Your creativity is expanding like the universe itself!",
      "The colors are showing me the truth about your grammar!",
      "I'm experiencing a spiritual awakening through your text!",
      "Your words are like a psychedelic journey through time!",
      "The cosmic forces are guiding your writing hand!",
      "I can see the future of literature in your sentences!",
      "Your prose is like a rainbow bridge to enlightenment!",
      "The colors are revealing the hidden meaning in your words!",
      "I'm having a transcendental experience with your grammar!",
      "Your writing is like a cosmic dance of consciousness!",
    ];
  }

  private getIntroMessage(): string {
    return "Hi, my name is Scribbles. I am here to help and support you.";
  }

  private showScribbles(message: string): void {
    if (this.clippyVisible) return;
    
    this.clippyVisible = true;
    this.clippy.classList.add('visible');
    
    const speechContent = this.clippySpeechBubble.querySelector('.speech-content') as HTMLElement;
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
        const messages = this.getScribblesMessages();
        let message;
        
        // If psychedelic mode is active, prefer psychedelic messages
        if (this.psychedelicEnabled) {
          const psychedelicMessages = messages.slice(33); // Psychedelic messages start at index 33
          const regularMessages = messages.slice(0, 33);
          
          // 70% chance for psychedelic messages, 30% for regular
          if (Math.random() < 0.7) {
            message = getRandomElement(psychedelicMessages);
          } else {
            message = getRandomElement(regularMessages);
          }
        } else {
          message = getRandomElement(messages.slice(0, 33)); // Only regular messages
        }
        
        this.showScribbles(message);
      }
    }, 15000); // Show Scribbles every 15 seconds with 30% chance
  }

  private initializeEventListeners(): void {
    this.editor.addEventListener('input', this.handleInput.bind(this));
    this.popupOverlay.addEventListener('click', this.dismissPopup.bind(this));
    
    // Add save button hover effect
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

    // Check if it's an upgrade popup (but not a system update popup)
    const popupTitle = document.getElementById('popup-title')?.textContent;
    const popupMessage = document.getElementById('popup-message')?.textContent;
    
    // Check if it's a mode cycling popup
    if (popupTitle && popupMessage) {
      // Handle psychedelic mode popup
      if (popupTitle.includes('Creative Enhancement') && this.currentMode === 'normal') {
        console.log('User accepted psychedelic mode popup');
        this.currentMode = 'psychedelic';
        this.enablePsychedelicBackground();
        
        // Clear the current timer and schedule next popup
        if (this.modeCycleTimer) {
          clearTimeout(this.modeCycleTimer);
        }
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 120000); // 2 minutes
        return;
      }
      
      // Handle dull mode popup
      if (popupTitle.includes('Focus Mode') && this.currentMode === 'psychedelic') {
        console.log('User accepted dull mode popup');
        this.currentMode = 'dull';
        this.enableDullMode();
        
        // Clear the current timer and schedule next popup
        if (this.modeCycleTimer) {
          clearTimeout(this.modeCycleTimer);
        }
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 90000); // 90 seconds
        return;
      }
      
      // Handle normal mode popup
      if (popupTitle.includes('Stability Update') && this.currentMode === 'dull') {
        console.log('User accepted normal mode popup');
        this.currentMode = 'normal';
        this.disableDullMode();
        
        // Clear the current timer and schedule next popup
        if (this.modeCycleTimer) {
          clearTimeout(this.modeCycleTimer);
        }
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 120000); // 2 minutes
        return;
      }
    }
    
    // Check if it's a system update popup that should trigger psychedelic mode
    if (popupTitle && popupMessage && 
        (popupTitle.includes('SmartWrite v') && 
         (popupMessage.includes('psychedelic') || popupMessage.includes('Creative Enhancement'))) &&
        this.currentMode !== 'normal') { // Don't trigger psychedelic mode if we're in normal mode
      // Enable psychedelic mode immediately for psychedelic system update popups only
      this.enablePsychedelicBackground();
      return;
    }
    
    // Don't show region restriction for system update popups
    if (popupTitle && popupMessage && 
        (popupTitle.includes('Upgrade') || popupTitle.includes('Pro') || popupTitle.includes('Free')) &&
        !popupTitle.includes('SmartWrite v') && 
        !popupMessage.includes('psychedelic') &&
        !popupMessage.includes('background')) {
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
    this.startModeCycling();
  }

  public destroy(): void {
    if (this.interferenceTimer) clearTimeout(this.interferenceTimer);
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    if (this.randomInterferenceTimer) clearInterval(this.randomInterferenceTimer);
    if (this.clippyTimer) clearInterval(this.clippyTimer);
    if (this.psychedelicTimer) clearInterval(this.psychedelicTimer);
    this.disablePsychedelicBackground();
  }

  private handleSaveButtonHover(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const originalText = button.textContent;
    
    // Only change button text to something ridiculous if psychedelic mode is active
    if (this.psychedelicEnabled) {
      button.textContent = '🚀 Launch to Mars';
      
      // Reset after a delay
      setTimeout(() => {
        button.textContent = originalText;
      }, 2000);
    }
  }

  private enablePsychedelicBackground(): void {
    if (this.psychedelicEnabled) return;
    
    this.psychedelicEnabled = true;
    this.body.classList.add('psychedelic-mode');
    this.startPsychedelicAnimation();
    
    // Show notification
    this.showNotification('🎨 Psychedelic mode activated! Your creativity is now enhanced!', 5000);
    
    // Add some psychedelic Scribbles messages
    setTimeout(() => {
      this.showScribbles("Whoa, dude! The colors are totally helping your writing flow!");
    }, 2000);
  }

  private startPsychedelicAnimation(): void {
    this.psychedelicTimer = setInterval(() => {
      this.updatePsychedelicBackground();
    }, PSYCHEDELIC_CONFIG.ANIMATION_SPEED);
  }

  private updatePsychedelicBackground(): void {
    if (!this.psychedelicEnabled) return;
    
    const colors = PSYCHEDELIC_CONFIG.COLOR_TRANSITIONS;
    const patterns = PSYCHEDELIC_CONFIG.PATTERNS;
    
    // Cycle through colors
    const color1 = colors[this.currentColorIndex];
    const color2 = colors[(this.currentColorIndex + 1) % colors.length];
    const color3 = colors[(this.currentColorIndex + 2) % colors.length];
    
    // Random pattern
    const pattern = getRandomElement(patterns);
    
    let background = '';
    switch (pattern) {
      case 'radial-gradient':
        background = `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${color1}, ${color2}, ${color3})`;
        break;
      case 'linear-gradient':
        background = `linear-gradient(${Math.random() * 360}deg, ${color1}, ${color2}, ${color3})`;
        break;
      case 'conic-gradient':
        background = `conic-gradient(from ${Math.random() * 360}deg, ${color1}, ${color2}, ${color3})`;
        break;
      case 'repeating-linear-gradient':
        background = `repeating-linear-gradient(${Math.random() * 360}deg, ${color1} 0%, ${color2} 25%, ${color3} 50%)`;
        break;
    }
    
    this.body.style.background = background;
    this.currentColorIndex = (this.currentColorIndex + 1) % colors.length;
  }

  private disablePsychedelicBackground(): void {
    this.psychedelicEnabled = false;
    this.body.classList.remove('psychedelic-mode');
    this.body.style.background = '';
    
    if (this.psychedelicTimer) {
      clearInterval(this.psychedelicTimer);
      this.psychedelicTimer = undefined;
    }
    // Always reset the save button text when psychedelic mode ends
    const saveButton = document.getElementById('save-button') as HTMLButtonElement;
    if (saveButton) {
      saveButton.textContent = '💾 Save to Cloud';
    }
  }

  private enableDullMode(): void {
    this.body.classList.add('dull-mode');
  }

  private disableDullMode(): void {
    this.body.classList.remove('dull-mode');
  }

  private startModeCycling(): void {
    // Start mode cycling after 60 seconds to let users explore other features
    setTimeout(() => {
      this.cycleToNextMode();
    }, 60000);
  }

  private cycleToNextMode(): void {
    console.log(`Mode cycling: current mode = ${this.currentMode}`);
    
    switch (this.currentMode) {
      case 'normal':
        // Show psychedelic mode popup but stay in normal mode
        console.log('Showing psychedelic mode popup');
        this.showPopup(
          '🎨 SmartWrite v2.2.0 - Creative Enhancement Update',
          'We\'ve detected you could benefit from psychedelic mode! Accept to boost your creative writing flow with trippy visuals that increase productivity by 420%.'
        );
        
        // Schedule next popup in 2 minutes if user doesn't accept
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 120000);
        break;
        
      case 'psychedelic':
        // Show dull mode popup but stay in psychedelic mode
        console.log('Showing dull mode popup');
        this.showPopup(
          '🌫️ SmartWrite v2.2.1 - Focus Mode Update',
          'Your writing has triggered our new focus mode! Accept to remove distracting colors and help you concentrate on your dull prose.'
        );
        
        // Schedule next popup in 90 seconds if user doesn't accept
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 90000);
        break;
        
      case 'dull':
        // Show normal mode popup but stay in dull mode
        console.log('Showing normal mode popup');
        this.showPopup(
          '✨ SmartWrite v2.2.2 - Stability Update',
          'We\'ve detected stability issues! Accept to restore normal mode for optimal writing performance. All systems will run at peak efficiency.'
        );
        
        // Schedule next popup in 120 seconds if user doesn't accept
        this.modeCycleTimer = setTimeout(() => {
          this.cycleToNextMode();
        }, 120000);
        break;
    }
  }
} 
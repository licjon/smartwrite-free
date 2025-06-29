import { WritingAssistant } from './writing-assistant';

let writingAssistant: WritingAssistant;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  writingAssistant = new WritingAssistant();
});

// Global functions for HTML onclick handlers
declare global {
  interface Window {
    acceptSuggestion: () => void;
    dismissPopup: () => void;
  }
}

window.acceptSuggestion = () => {
  if (writingAssistant) {
    writingAssistant.acceptSuggestion();
  }
};

window.dismissPopup = () => {
  if (writingAssistant) {
    writingAssistant.dismissPopup();
  }
}; 
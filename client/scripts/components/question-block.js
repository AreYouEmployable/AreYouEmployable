import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/question-block.css' }
});

createElementAndAppend(template.content, 'question-container');

createElementAndAppend(template.content, 'section', {
  props: { className: 'options-wrapper', id: 'options' }
});

createElementAndAppend(template.content, 'button', {
  props: {
    id: 'submitBtn',
    className: 'submit-btn',
    textContent: 'Submit Answer'
  }
});

class QuestionBlock extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._questionContainer = this.shadowRoot.querySelector('question-container');
    this._optionsContainer = this.shadowRoot.getElementById('options');
    this._submitButton = this.shadowRoot.getElementById('submitBtn');
  }

  connectedCallback() {
    if (this._submitButton) {
      this._submitButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('submit-answer', {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  disconnectedCallback() {
    if (this._submitButton) {
      this._submitButton.removeEventListener('click', () => {});
    }
  }

  set questionText(text) {
    if (this._questionContainer) {
        this._questionContainer.question = text;
    } else {
        console.warn('QuestionBlock: question-container element not found.');
    }
  }

  set options(optionTexts) {
    if (!this._optionsContainer) {
        console.warn('QuestionBlock: Options container not found.');
        return;
    }

    while (this._optionsContainer.firstChild) {
      this._optionsContainer.removeChild(this._optionsContainer.firstChild);
    }

    if (Array.isArray(optionTexts)) {
      optionTexts.forEach(text => {
        createElementAndAppend(this._optionsContainer, 'answer-option', {
          props: { text: text } // Assuming 'answer-option' has a 'text' property
        });
      });
    } else {
        console.warn('QuestionBlock: options provided are not an array.', optionTexts);
    }
  }

  get selectedOptions() {
    const options = this.shadowRoot.querySelectorAll('answer-option');
    return Array.from(options)
      .map((el, i) => el.selected ? i : null)
      .filter(i => i !== null);
  }
}

customElements.define('question-block', QuestionBlock);

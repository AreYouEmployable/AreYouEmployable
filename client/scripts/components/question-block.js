const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/question-block.css');
template.content.appendChild(stylesheetLink);

// Assuming 'question-container' is a custom element.
// It's good practice to ensure its definition is loaded before 'question-block' is used,
// or handle potential undefined custom elements gracefully.
const questionContainerElement = document.createElement('question-container');
template.content.appendChild(questionContainerElement);

const optionsWrapperSection = document.createElement('section');
optionsWrapperSection.classList.add('options-wrapper');
optionsWrapperSection.id = 'options';
template.content.appendChild(optionsWrapperSection);

const submitButton = document.createElement('button');
submitButton.id = 'submitBtn';
submitButton.classList.add('submit-btn');
submitButton.textContent = 'Submit Answer';
template.content.appendChild(submitButton);

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
    // It's good practice to remove event listeners when the component is disconnected
    // to prevent memory leaks, though for simple click listeners on shadow DOM elements
    // that get garbage collected with the component, it might not be strictly necessary.
    // However, if this._submitButton could be null or re-assigned, more care is needed.
    // For this example, assuming it's straightforward.
  }

  set questionText(text) {
    if (this._questionContainer) {
        // Assuming 'question-container' has a 'question' property or attribute setter
        // If it's an attribute: this._questionContainer.setAttribute('question', text);
        // If it's a property:
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

    // Clear previous options using DOM manipulation
    while (this._optionsContainer.firstChild) {
      this._optionsContainer.removeChild(this._optionsContainer.firstChild);
    }

    if (Array.isArray(optionTexts)) {
      optionTexts.forEach(text => {
        // Assuming 'answer-option' is a custom element.
        // Its definition should be loaded before 'question-block' attempts to create it.
        const option = document.createElement('answer-option');
        // Assuming 'answer-option' has a 'text' property or attribute setter
        // If it's an attribute: option.setAttribute('text', text);
        // If it's a property:
        option.text = text;
        this._optionsContainer.appendChild(option);
      });
    } else {
        console.warn('QuestionBlock: options provided are not an array.', optionTexts);
    }
  }

  get selectedOptions() {
    // Ensure querySelectorAll is called on the shadowRoot or a known container
    const options = this.shadowRoot.querySelectorAll('answer-option');
    return Array.from(options)
      // Assuming 'answer-option' has a 'selected' boolean property
      .map((el, i) => el.selected ? i : null) // Or el.hasAttribute('selected')
      .filter(i => i !== null);
  }
}

customElements.define('question-block', QuestionBlock);

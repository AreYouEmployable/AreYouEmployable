const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/question-block.css');
template.content.appendChild(stylesheetLink);

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
        const option = document.createElement('answer-option');
        option.text = text;
        this._optionsContainer.appendChild(option);
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

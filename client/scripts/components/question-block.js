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
  }

  connectedCallback() {
    this.shadowRoot.getElementById('submitBtn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('submit-answer', {
        bubbles: true,
        composed: true
      }));
    });
  }

  set questionText(text) {
    this.shadowRoot.querySelector('question-container').question = text;
  }

  set options(optionTexts) {
    const container = this.shadowRoot.getElementById('options');
    container.innerHTML = ''; 
    optionTexts.forEach(text => {
      const option = document.createElement('answer-option');
      option.text = text;
      container.appendChild(option);
    });
  }

  get selectedOptions() {
    return Array.from(this.shadowRoot.querySelectorAll('answer-option'))
      .map((el, i) => el.selected ? i : null)
      .filter(i => i !== null);
  }
}

customElements.define('question-block', QuestionBlock);

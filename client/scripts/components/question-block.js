const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/question-block.css">
  <complexity-level-bar level="medium"></complexity-level-bar>
  <question-container></question-container>
  <section class="options-wrapper" id="options"></section>
  <button id="submitBtn" class="submit-btn">Submit Answer</button>
`;

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

  set complexity(level) {
    this.shadowRoot.querySelector('complexity-level-bar').setAttribute('level', level);
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

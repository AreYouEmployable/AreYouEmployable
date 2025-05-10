const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/answer-option.css">
  <label class="option-box">
    <input type="checkbox" />
    <span class="text" id="labelText">Answer option</span>
  </label>
`;

class AnswerOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set text(val) {
    this.shadowRoot.getElementById('labelText').textContent = val;
  }

  get selected() {
    return this.shadowRoot.querySelector('input').checked;
  }

  set selected(val) {
    this.shadowRoot.querySelector('input').checked = val;
  }
}

customElements.define('answer-option', AnswerOption);


// components/options-list/options-list.js
class OptionsList extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <link rel="stylesheet" href="components/options-list/options-list.css">
        <div class="options-list">
          <slot></slot>
        </div>
      `;
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }
  }
  customElements.define('options-list', OptionsList);
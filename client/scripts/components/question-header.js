const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="styles/components/question-header.css">
  <div class="question-header">
    <h2 id="question-title"></h2>
    <p id="question-description"></p>
  </div>
`;

class QuestionHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    this.questionTitleElement = this.shadowRoot.getElementById('question-title');
    this.questionDescriptionElement = this.shadowRoot.getElementById('question-description');
    this._title = '';
    this._description = '';
  }

  static get observedAttributes() {
    return ['title', 'description'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && oldValue !== newValue) {
      this._title = newValue;
      this.render();
    } else if (name === 'description' && oldValue !== newValue) {
      this._description = newValue;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.questionTitleElement.textContent = this._title;
    this.questionDescriptionElement.textContent = this._description;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this.setAttribute('title', value);
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this.setAttribute('description', value);
  }
}

customElements.define('question-header', QuestionHeader);
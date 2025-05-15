const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', 'styles/components/question-header.css');
template.content.appendChild(stylesheetLink);

const headerElement = document.createElement('header');
headerElement.classList.add('question-header');

const h2Element = document.createElement('h2');
h2Element.id = 'question-title';
headerElement.appendChild(h2Element);

const pElement = document.createElement('p');
pElement.id = 'question-description';
headerElement.appendChild(pElement);

template.content.appendChild(headerElement);
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

import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: 'styles/components/question-header.css' }
});

const headerElement = createElementAndAppend(template.content, 'header', {
  classList: ['question-header']
});

createElementAndAppend(headerElement, 'h2', {
  props: { id: 'question-title' }
});

createElementAndAppend(headerElement, 'p', {
  props: { id: 'question-description' }
});

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
    if (this.hasAttribute('title')) {
        this._title = this.getAttribute('title');
    }
    if (this.hasAttribute('description')) {
        this._description = this.getAttribute('description');
    }
    this.render();
  }

  render() {
    if (this.questionTitleElement) {
        this.questionTitleElement.textContent = this._title;
    }
    if (this.questionDescriptionElement) {
        this.questionDescriptionElement.textContent = this._description;
    }
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

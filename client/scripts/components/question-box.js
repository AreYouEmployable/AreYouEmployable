import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: 'styles/components/question-box.css' }
});

const articleElement = createElementAndAppend(template.content, 'article', {
  classList: ['question-box']
});

createElementAndAppend(articleElement, 'p', {
  props: {
    id: 'questionText',
    textContent: 'The production website is showing a blank page. What\'s your first step?'
  }
});

class QuestionBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  set questionText(text) {
    const questionTextElement = this.shadowRoot.querySelector('#questionText');
    if (questionTextElement) {
        questionTextElement.textContent = text;
    }
  }
}

customElements.define('question-box', QuestionBox);

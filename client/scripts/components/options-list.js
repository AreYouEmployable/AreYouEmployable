import { createElementAndAppend } from '../utils.js';

const optionsListTemplate = document.createElement('template');

createElementAndAppend(optionsListTemplate.content, 'link', {
  attrs: { rel: 'stylesheet', href: 'styles/components/options-list.css' }
});

const sectionElement = createElementAndAppend(optionsListTemplate.content, 'section', {
  classList: ['options-list']
});

createElementAndAppend(sectionElement, 'slot');

class OptionsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(optionsListTemplate.content.cloneNode(true));
  }
}

customElements.define('options-list', OptionsList);

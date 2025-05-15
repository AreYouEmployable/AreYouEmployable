// submit-button.js

import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: 'styles/components/submit-button.css' }
});

createElementAndAppend(template.content, 'button', {
  props: { textContent: 'Submit Answer' },
  classList: ['submit-button']
});

class SubmitButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['disabled', 'text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const button = this.shadowRoot.querySelector('button');
    if (!button) return;

    if (name === 'disabled') {
      button.disabled = this.hasAttribute('disabled');
    } else if (name === 'text' && oldValue !== newValue) {
      button.textContent = newValue;
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get text() {
    return this.getAttribute('text');
  }

  set text(val) {
    this.setAttribute('text', val);
  }
}

customElements.define('submit-button', SubmitButton);

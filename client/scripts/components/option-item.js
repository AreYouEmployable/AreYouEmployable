import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/option-item.css' }
});

const labelElement = createElementAndAppend(template.content, 'label', {
  classList: ['flex', 'items-center', 'space-x-2']
});

createElementAndAppend(labelElement, 'input', {
  attrs: { type: 'checkbox', name: 'answer' },
  classList: ['form-checkbox', 'text-blue-600']
});

createElementAndAppend(labelElement, 'slot');

class OptionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const label = this.getAttribute('label');
    const id = this.getAttribute('data-id');

    const slotElement = this.shadowRoot.querySelector('slot');
    if (slotElement) {
        slotElement.textContent = label;
    }

    const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]');
    if (checkbox) {
        checkbox.value = id;
    }
  }
}

customElements.define('option-item', OptionItem);
// dynamic-button.js

import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/dynamic-button.css' }
});

const buttonElement = createElementAndAppend(template.content, 'button', {
  classList: ['btn']
});

createElementAndAppend(buttonElement, 'slot', {
  props: { textContent: 'Click Me' }
});

class DynamicButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const btn = this.shadowRoot.querySelector('button');

    const bgColor = this.getAttribute('bg-color') || '#3b82f6';
    const textColor = this.getAttribute('text-color') || '#ffffff';
    btn.style.backgroundColor = bgColor;
    btn.style.color = textColor;

    const text = this.getAttribute('text');
    if (text) {
      const slot = btn.querySelector('slot');
      if (slot) {
        slot.textContent = text;
      } else {
        btn.textContent = text;
      }
    }

    const isClickable = this.hasAttribute('clickable') && this.getAttribute('clickable') !== 'false';
    btn.disabled = !isClickable;

    const isActive = this.hasAttribute('active') && this.getAttribute('active') !== 'false';
    if (isActive) {
      btn.classList.add('active');
    }

    btn.onclick = () => {
      if (isClickable && this.hasAttribute('on-click')) {
        const eventName = this.getAttribute('on-click');
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
      }
    };
  }
}

customElements.define('dynamic-button', DynamicButton);

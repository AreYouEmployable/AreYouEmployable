// forbidden-page.js

import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/error-page.css' }
});

const articleElement = createElementAndAppend(template.content, 'article', {
  classList: ['error-container']
});

const summaryElement = createElementAndAppend(articleElement, 'summary', {
  classList: ['error-content']
});

createElementAndAppend(summaryElement, 'h1', {
  props: { textContent: 'Access Denied' },
  classList: ['error-title']
});

createElementAndAppend(summaryElement, 'p', {
  props: { textContent: 'You do not have permission to access this resource.' },
  classList: ['error-message']
});

const sectionActionsElement = createElementAndAppend(summaryElement, 'section', {
  classList: ['error-actions']
});

createElementAndAppend(sectionActionsElement, 'button', {
  props: { id: 'goHomeBtn', textContent: 'Go to Home' },
  classList: ['primary-button']
});

createElementAndAppend(sectionActionsElement, 'button', {
  props: { id: 'signInBtn', textContent: 'Sign In' },
  classList: ['secondary-button']
});

export class ForbiddenPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.goHomeBtn = this.shadowRoot.querySelector('#goHomeBtn');
        this.signInBtn = this.shadowRoot.querySelector('#signInBtn');
        this.errorTitleElement = this.shadowRoot.querySelector('.error-title');
        this.errorMessageElement = this.shadowRoot.querySelector('.error-message');
    }

    connectedCallback() {
        if (this.hasAttribute('error-title')) {
            this.errorTitleElement.textContent = this.getAttribute('error-title');
        }
        if (this.hasAttribute('error-message')) {
            this.errorMessageElement.textContent = this.getAttribute('error-message');
        }

        if (this.goHomeBtn) {
            this.goHomeBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('gohome', { bubbles: true, composed: true }));
            });
        }

        if (this.signInBtn) {
            this.signInBtn.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('signin', { bubbles: true, composed: true }));
            });
        }
    }

    static get observedAttributes() {
        return ['error-title', 'error-message'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue) return;
        switch (name) {
            case 'error-title':
                if (this.errorTitleElement) this.errorTitleElement.textContent = newValue;
                break;
            case 'error-message':
                if (this.errorMessageElement) this.errorMessageElement.textContent = newValue;
                break;
        }
    }
}

customElements.define('forbidden-page', ForbiddenPage);

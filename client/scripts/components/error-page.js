import { createElementAndAppend } from '../utils.js';
import { AuthService } from '../services/auth.js';

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
  props: { id: 'signOutBtn', textContent: 'Sign Out' },
  classList: ['secondary-button']
});

class ErrorPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const goHomeBtn = this.shadowRoot.getElementById('goHomeBtn');
    const signOutBtn = this.shadowRoot.getElementById('signOutBtn');

    if (goHomeBtn) {
      goHomeBtn.addEventListener('click', () => {
        window.location.href = '/';
      });
    }

    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        await AuthService.logout();
        window.location.href = '/';
      });
    }
  }
}

customElements.define('error-page', ErrorPage);

import { store } from '../state.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/error-page.css">
  <article class="error-container">
    <summary class="error-content">
      <h1 class="error-title">Access Denied</h1>
      <p class="error-message">You do not have permission to access this resource.</p>
      <section class="error-actions">
        <button id="goHomeBtn" class="primary-button">Go to Home</button>
        <button id="signOutBtn" class="secondary-button">Sign Out</button>
      </section>
    </summary>
  </article>
`;

class ErrorPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const goHomeBtn = this.shadowRoot.getElementById('goHomeBtn');
    const signOutBtn = this.shadowRoot.getElementById('signOutBtn');

    goHomeBtn.addEventListener('click', () => {
      window.location.href = '/';
    });

    signOutBtn.addEventListener('click', async () => {
      await AuthService.logout();
      window.location.href = '/';
    });
  }
}

customElements.define('error-page', ErrorPage); 
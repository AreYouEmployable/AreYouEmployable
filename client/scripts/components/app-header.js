import { createElement } from '../utils.js';
import { store, actions } from '../state.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/app-header.css">
  <header>
    <h1>Employable</h1>
    <nav>
      <ul>
        <li><a href="/" data-link>Home</a></li>
        <li><a href="/about" data-link>About</a></li>
        <li><a href="/contact" data-link>Contact</a></li>
      </ul>
    </nav>
    <section id="auth-container"></section>
  </header>
`;

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.authContainer = this.shadowRoot.querySelector('#auth-container');
    this.navItems = this.shadowRoot.querySelectorAll('nav a');
    this.unsubscribe = null;
    
    this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  }

  connectedCallback() {
    this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
    this.renderGoogleSignIn();
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleStateChange(state) {
    document.documentElement.setAttribute('data-theme', state.theme);
    this.updateNavVisibility(state.auth.isAuthenticated);
  }

  handleLinkClick(e) {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  renderGoogleSignIn() {
    const googleSignIn = document.createElement('google-sign-in');
    this.authContainer.appendChild(googleSignIn);
  }

  updateNavVisibility(isAuthenticated) {
    this.navItems.forEach(item => {
      if (item.getAttribute('href') !== '/') {
        item.style.display = isAuthenticated ? 'inline-block' : 'none';
      }
    });
  }
}

customElements.define('app-header', AppHeader);
import { store } from '../state.js'; 
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/app-header.css">
  <header>
    <h1><a href="/" class="logo">Employability Assessment</a></h1>
    <button class="hamburger" id="hamburger" aria-label="Open Menu">
      <i></i><i></i><i></i>
    </button>
    <nav class="nav-links" aria-label="Main Navigation"></nav>
  </header>
  <aside class="mobile-menu" id="mobile-menu" aria-label="Mobile Navigation">
    <button class="close-button" id="close-menu" aria-label="Close Menu">&times;</button>
  </aside>
`;

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.state = store.getState();
    this.unsubscribe = null;
  }

  connectedCallback() {
    this.render();
    this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleStateChange(state) {
    this.state = state;
    this.render();
  }

  render() {
    const { isAuthenticated, user } = this.state.auth;
    const pictureUrl = user?.picture;

    const nav = this.shadowRoot.querySelector('nav');
    const aside = this.shadowRoot.querySelector('aside');
    nav.innerHTML = isAuthenticated ? `
      <ul>
        <li><a href="/assessment" class="assessment-page">Assessment</a></li>
        <li><a href="/results">Results</a></li>
        <li>
          <figure class="user-info">
            ${pictureUrl ? `
              <img src="${pictureUrl}" alt="${user?.name || 'User'}" class="user-avatar" 
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <figcaption class="user-avatar-placeholder" style="display: none;">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</figcaption>
            ` : `
              <figcaption class="user-avatar-placeholder">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</figcaption>
            `}
            <strong class="user-name">${user?.name || 'User'}</strong>
            <button class="sign-out" type="button">Sign Out</button>
          </figure>
        </li>
      </ul>
    ` : `<section><google-sign-in></google-sign-in></section>`;

    aside.innerHTML = isAuthenticated ? `
      <nav>
        <ul>
          <li><a href="/assessment" class="assessment-link">Assessment</a></li>
          <li><a href="/results">Results</a></li>
        </ul>
      </nav>
      <section class="user-info">
        ${pictureUrl ? `
          <img src="${pictureUrl}" alt="${user?.name || 'User'}" class="user-avatar"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <figcaption class="user-avatar-placeholder" style="display: none;">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</figcaption>
        ` : `
          <figcaption class="user-avatar-placeholder">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</figcaption>
        `}
        <strong class="user-name">${user?.name || 'User'}</strong>
        <button class="sign-out" type="button">Sign Out</button>
      </section>
    ` : `<section><google-sign-in></google-sign-in></section>`;

    this.shadowRoot.querySelectorAll('.assessment-link').forEach(link => {
      link.addEventListener('click', e => {
        if (!isAuthenticated) {
          e.preventDefault();
          AuthService.signInWithGoogle();
        }
      });
    });

    const signOutButton = this.shadowRoot.querySelector('.sign-out');
    if (signOutButton) {
      signOutButton.addEventListener('click', () => {
        AuthService.logout();
      });
    }

    const hamburger = this.shadowRoot.querySelector('#hamburger');
    const closeBtn = this.shadowRoot.querySelector('#close-menu');
    const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.addEventListener('click', e => {
      if (mobileMenu.classList.contains('active') &&
          !mobileMenu.contains(e.target) &&
          !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    this.shadowRoot.querySelectorAll('[href][data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  }

  handleLinkClick(e) {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('app-header', AppHeader);

import { store } from '../state.js'; 
import { AuthService } from '../services/auth.js';
import { router } from '../router.js';

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
    <div id="auth-container"></div>
  </header>
`;

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    this.authContainer = this.shadowRoot.querySelector('#auth-container');
    this.navElement = this.shadowRoot.querySelector('nav'); 
    this.navLinks = this.shadowRoot.querySelectorAll('nav a');
    this.unsubscribe = null;
    
    this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });

    this.state = store.getState();
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
    
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/styles/components/app-header.css">
      <header>
        <section class="header-content">
          <a href="/" class="logo" data-link>Are You Employable?</a>
          <button class="hamburger" id="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <section class="nav-links">
            ${isAuthenticated ? `
              <a href="/assessment" class="assessment-link" data-link>Assessment</a>
              <a href="/results" data-link>Results</a>
              <a href="/contact" data-link>Contact</a>
              <section class="user-info">
                ${pictureUrl ? `
                  <img src="${pictureUrl}" alt="${user?.name || 'User image'}" class="user-avatar" 
                    onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <p class="user-avatar-placeholder" style="display: none;">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</p>
                ` : `
                  <p class="user-avatar-placeholder">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</p>
                `}
                <span class="user-name">${user?.name || 'User'}</span>
                <span class="sign-out">Sign Out</span>
              </section>
            ` : `
              <google-sign-in></google-sign-in>
            `}
          </section>
        </section>
      </header>
      <section class="mobile-menu" id="mobile-menu">
        <button class="close-button" id="close-menu">&times;</button>
        ${isAuthenticated ? `
          <div class="nav-links">
            <a href="/assessment" class="assessment-link" data-link>Assessment</a>
            <a href="/results" data-link>Results</a>
          </div>
          <section class="user-info">
            ${pictureUrl ? `
              <img src="${pictureUrl}" alt="${user?.name || 'User'}" class="user-avatar"
                onerror="console.error('Failed to load image:', this.src); this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <p class="user-avatar-placeholder" style="display: none;">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</p>
            ` : `
              <p class="user-avatar-placeholder">${user?.name?.charAt(0)?.toUpperCase() || 'G'}</p>
            `}
            <span class="user-name">${user?.name || 'User'}</span>
            <span class="sign-out">Sign Out</span>
          </section>
        ` : `
          <google-sign-in></google-sign-in>
        `}
      </section>
    `;

    this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });

    const hamburger = this.shadowRoot.querySelector('#hamburger');
    const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');
    const closeButton = this.shadowRoot.querySelector('#close-menu');

    if (hamburger && mobileMenu && closeButton) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      closeButton.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });

      document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    const assessmentLinks = this.shadowRoot.querySelectorAll('.assessment-link');
    assessmentLinks.forEach(link => {
      link.addEventListener('click', (e) => {
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
  }

  handleLinkClick(e) {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    router.navigateTo(path);
  }

  async renderGoogleSignIn() {
    try {
      if (!this.authContainer.querySelector('google-sign-in')) {
        this.authContainer.innerHTML = '';
        
        const googleSignIn = document.createElement('google-sign-in');
        
        this.authContainer.appendChild(googleSignIn);
        
        await customElements.whenDefined('google-sign-in');
      }
    } catch (error) {
      console.error('Error rendering Google sign-in:', error);
    }
  }
}

customElements.define('app-header', AppHeader);
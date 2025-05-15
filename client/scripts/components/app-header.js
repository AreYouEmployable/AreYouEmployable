import { store } from '../state.js';
import { store } from '../state.js';
import { AuthService } from '../services/auth.js';
import { router } from '../router.js';
// Assuming google-sign-in is imported if AppHeader creates it,
// but it seems to be used as a tag <google-sign-in> directly.
// If it's a custom element, its definition should be imported somewhere globally or in app.js.

const template = document.createElement('template');

const initialStylesheetLink = document.createElement('link');
initialStylesheetLink.setAttribute('rel', 'stylesheet');
initialStylesheetLink.setAttribute('href', '/styles/components/app-header.css');
template.content.appendChild(initialStylesheetLink);

const initialHeaderElement = document.createElement('header');
const initialH1Element = document.createElement('h1');
initialH1Element.textContent = 'Employable';
initialHeaderElement.appendChild(initialH1Element);

const initialNavElement = document.createElement('nav');
const initialUlElement = document.createElement('ul');
const initialNavItems = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/contact', text: 'Contact' },
];
initialNavItems.forEach(item => {
  const liElement = document.createElement('li');
  const aElement = document.createElement('a');
  aElement.setAttribute('href', item.href);
  aElement.setAttribute('data-link', '');
  aElement.textContent = item.text;
  liElement.appendChild(aElement);
  initialUlElement.appendChild(liElement);
});
initialNavElement.appendChild(initialUlElement);
initialHeaderElement.appendChild(initialNavElement);

const initialAuthContainerSection = document.createElement('section');
initialAuthContainerSection.id = 'auth-container';
initialHeaderElement.appendChild(initialAuthContainerSection);
template.content.appendChild(initialHeaderElement);

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.unsubscribe = null;
    this.state = store.getState();
    this._boundHandleDocumentClickForMenu = null;
  }

  connectedCallback() {
    this.render();
    this.unsubscribe = store.subscribe(this.handleStateChange.bind(this));
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    if (this._boundHandleDocumentClickForMenu) {
        document.removeEventListener('click', this._boundHandleDocumentClickForMenu);
        this._boundHandleDocumentClickForMenu = null;
    }
  }

  handleStateChange(newState) {
    this.state = newState;
    this.render();
  }

  createElement(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
    return el;
  }

  render() {
    const shadow = this.shadowRoot;
    shadow.innerHTML = '';

    const styleLink = this.createElement('link', {
      rel: 'stylesheet',
      href: '/styles/components/app-header.css'
    });

    const header = this.createElement('header', {}, [
      this.createElement('h1', {}, [
        this.createElement('a', { href: '/', class: 'logo' }, ['Employability Assessment'])
      ]),
      this.createElement('button', {
        class: 'hamburger',
        id: 'hamburger',
        'aria-label': 'Open Menu'
      }, [this.createElement('i'), this.createElement('i'), this.createElement('i')]),
      this.createElement('nav', {
        class: 'nav-links',
        'aria-label': 'Main Navigation'
      })
    ]);

    const aside = this.createElement('aside', {
      class: 'mobile-menu',
      id: 'mobile-menu',
      'aria-label': 'Mobile Navigation'
    }, [
      this.createElement('button', {
        class: 'close-button',
        id: 'close-menu',
        'aria-label': 'Close Menu'
      }, ['×'])
    ]);

    shadow.append(styleLink, header, aside);

    const nav = shadow.querySelector('nav');
    const mobileMenu = shadow.querySelector('#mobile-menu');
    const { isAuthenticated, user } = this.state.auth;
    const pictureUrl = user?.picture;

    while (this.shadowRoot.firstChild) {
        this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    const stylesheetLink = document.createElement('link');
    stylesheetLink.setAttribute('rel', 'stylesheet');
    stylesheetLink.setAttribute('href', '/styles/components/app-header.css');
    this.shadowRoot.appendChild(stylesheetLink);

    const header = document.createElement('header');
    const headerContent = document.createElement('section');
    headerContent.className = 'header-content';

    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.className = 'logo';
    logoLink.setAttribute('data-link', '');
    logoLink.textContent = 'Employability Assessment';
    headerContent.appendChild(logoLink);

    const hamburgerButton = document.createElement('button');
    hamburgerButton.className = 'hamburger';
    hamburgerButton.id = 'hamburger';
    for (let i = 0; i < 3; i++) {
      const span = document.createElement('span');
      hamburgerButton.appendChild(span);
    }
    headerContent.appendChild(hamburgerButton);

    const navLinksContainer = document.createElement('nav');
    navLinksContainer.className = 'nav-links';

    if (isAuthenticated) {
      const assessmentLink = document.createElement('a');
      assessmentLink.href = '/assessment';
      assessmentLink.className = 'assessment-link';
      assessmentLink.setAttribute('data-link', '');
      assessmentLink.textContent = 'Assessment';
      navLinksContainer.appendChild(assessmentLink);

      const resultsLink = document.createElement('a');
      resultsLink.href = '/results';
      resultsLink.setAttribute('data-link', '');
      resultsLink.textContent = 'Results';
      navLinksContainer.appendChild(resultsLink);

      const userInfoSection = document.createElement('section');
      userInfoSection.className = 'user-info';

      if (pictureUrl) {
        const userAvatarImg = document.createElement('img');
        userAvatarImg.src = pictureUrl;
        userAvatarImg.alt = user?.name || 'User image';
        userAvatarImg.className = 'user-avatar';
        userAvatarImg.onerror = function() {
          this.style.display = 'none';
          if (this.nextElementSibling && this.nextElementSibling.classList.contains('user-avatar-placeholder')) {
            this.nextElementSibling.style.display = 'flex';
          }
        };
        userInfoSection.appendChild(userAvatarImg);

        const userAvatarPlaceholderImgError = document.createElement('p');
        userAvatarPlaceholderImgError.className = 'user-avatar-placeholder';
        userAvatarPlaceholderImgError.style.display = 'none';
        userAvatarPlaceholderImgError.textContent = user?.name?.charAt(0)?.toUpperCase() || 'G';
        userInfoSection.appendChild(userAvatarPlaceholderImgError);
      } else {
        const userAvatarPlaceholder = document.createElement('p');
        userAvatarPlaceholder.className = 'user-avatar-placeholder';
        userAvatarPlaceholder.textContent = user?.name?.charAt(0)?.toUpperCase() || 'G';
        userInfoSection.appendChild(userAvatarPlaceholder);
      }

      const userNameSpan = document.createElement('span');
      userNameSpan.className = 'user-name';
      userNameSpan.textContent = user?.name || 'User';
      userInfoSection.appendChild(userNameSpan);

      const signOutSpan = document.createElement('span');
      signOutSpan.className = 'sign-out';
      signOutSpan.textContent = 'Sign Out';
      userInfoSection.appendChild(signOutSpan);
      navLinksContainer.appendChild(userInfoSection);
    } else {
      const googleSignInElement = document.createElement('google-sign-in');
      navLinksContainer.appendChild(googleSignInElement);
    }
    headerContent.appendChild(navLinksContainer);
    header.appendChild(headerContent);
    this.shadowRoot.appendChild(header);

    const mobileMenuSection = document.createElement('section');
    mobileMenuSection.className = 'mobile-menu';
    mobileMenuSection.id = 'mobile-menu';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.id = 'close-menu';
    closeButton.textContent = '\u00D7';
    mobileMenuSection.appendChild(closeButton);

    const mobileNavLinksContainer = document.createElement('nav');
    mobileNavLinksContainer.className = 'mobile-nav-links';

    if (isAuthenticated) {
      const mobileAssessmentLink = document.createElement('a');
      mobileAssessmentLink.href = '/assessment';
      mobileAssessmentLink.className = 'assessment-link';
      mobileAssessmentLink.setAttribute('data-link', '');
      mobileAssessmentLink.textContent = 'Assessment';
      mobileNavLinksContainer.appendChild(mobileAssessmentLink);

      const mobileResultsLink = document.createElement('a');
      mobileResultsLink.href = '/results';
      mobileResultsLink.setAttribute('data-link', '');
      mobileResultsLink.textContent = 'Results';
      mobileNavLinksContainer.appendChild(mobileResultsLink);

      const mobileUserInfoSection = document.createElement('section');
      mobileUserInfoSection.className = 'user-info';

      if (pictureUrl) {
        const mobileUserAvatarImg = document.createElement('img');
        mobileUserAvatarImg.src = pictureUrl;
        mobileUserAvatarImg.alt = user?.name || 'User';
        mobileUserAvatarImg.className = 'user-avatar';
        mobileUserAvatarImg.onerror = function() {
          this.style.display = 'none';
           if (this.nextElementSibling && this.nextElementSibling.classList.contains('user-avatar-placeholder')) {
            this.nextElementSibling.style.display = 'flex';
          }
        };
        mobileUserInfoSection.appendChild(mobileUserAvatarImg);
        const mobileUserAvatarPlaceholderImgError = document.createElement('p');
        mobileUserAvatarPlaceholderImgError.className = 'user-avatar-placeholder';
        mobileUserAvatarPlaceholderImgError.style.display = 'none';
        mobileUserAvatarPlaceholderImgError.textContent = user?.name?.charAt(0)?.toUpperCase() || 'G';
        mobileUserInfoSection.appendChild(mobileUserAvatarPlaceholderImgError);
      } else {
        const mobileUserAvatarPlaceholder = document.createElement('p');
        mobileUserAvatarPlaceholder.className = 'user-avatar-placeholder';
        mobileUserAvatarPlaceholder.textContent = user?.name?.charAt(0)?.toUpperCase() || 'G';
        mobileUserInfoSection.appendChild(mobileUserAvatarPlaceholder);
      }

      const mobileUserNameSpan = document.createElement('span');
      mobileUserNameSpan.className = 'user-name';
      mobileUserNameSpan.textContent = user?.name || 'User';
      mobileUserInfoSection.appendChild(mobileUserNameSpan);

      const mobileSignOutSpan = document.createElement('span');
      mobileSignOutSpan.className = 'sign-out';
      mobileSignOutSpan.textContent = 'Sign Out';
      mobileUserInfoSection.appendChild(mobileSignOutSpan);
      mobileNavLinksContainer.appendChild(mobileUserInfoSection);
    } else {
      const mobileGoogleSignInElement = document.createElement('google-sign-in');
      mobileNavLinksContainer.appendChild(mobileGoogleSignInElement);
    }
    mobileMenuSection.appendChild(mobileNavLinksContainer);
    this.shadowRoot.appendChild(mobileMenuSection);

    this.shadowRoot.querySelectorAll('[data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });

    const hamburger = this.shadowRoot.querySelector('#hamburger');
    const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');
    const closeMenuButton = this.shadowRoot.querySelector('#close-menu');

    if (hamburger && mobileMenu && closeMenuButton) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      closeMenuButton.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
      
      if (this._boundHandleDocumentClickForMenu) {
        document.removeEventListener('click', this._boundHandleDocumentClickForMenu);
      }
      this._boundHandleDocumentClickForMenu = this.handleDocumentClickForMenu.bind(this, mobileMenu, hamburger);
      document.addEventListener('click', this._boundHandleDocumentClickForMenu);
    }

    this.shadowRoot.querySelectorAll('.assessment-link').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!this.state.auth.isAuthenticated) {
          e.preventDefault();
          AuthService.signInWithGoogle();
        }
      });
    });

    this.shadowRoot.querySelectorAll('.sign-out').forEach(button => {
        button.addEventListener('click', () => {
            AuthService.logout();
        });
    });
  }

  handleDocumentClickForMenu(mobileMenu, hamburger, e) {
    if (mobileMenu && hamburger && mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
    const currentPath = window.location.pathname;

    nav.innerHTML = '';
    if (isAuthenticated) {
      const avatarElement = pictureUrl
        ? this.createElement('img', {
            src: pictureUrl,
            alt: user?.name || 'User',
            class: 'user-avatar'
          })
        : this.createElement('figcaption', {
            class: 'user-avatar-placeholder'
          }, [user?.name?.charAt(0)?.toUpperCase() || 'G']);

      const userInfo = this.createElement('div', { class: 'user-info' }, [
        avatarElement,
        this.createElement('strong', { class: 'user-name' }, [user?.name || 'User']),
        this.createElement('button', {
          class: 'sign-out',
          type: 'button',
          onclick: () => AuthService.logout()
        }, ['Sign Out'])
      ]);

      const navLinks = [];
      if (currentPath !== '/') {
        navLinks.push({ href: '/', text: 'Home' });
      }
      navLinks.push(
        { href: '/about', text: 'About Us' },
        { href: '/contact', text: 'Contact' },
        { href: '/results', text: 'Results' }
      );
      navLinks.push({ element: userInfo });

      const navUl = this.createElement('ul', {}, navLinks.map(link => {
        if (link.element) {
          return this.createElement('li', {}, [link.element]);
        }
        return this.createElement('li', {}, [
          this.createElement('a', { href: link.href, class: link.class, 'data-link': '' }, [link.text])
        ]);
      }));
      nav.appendChild(navUl);

      const asideNav = this.createElement('nav', {}, [
        this.createElement('ul', {}, [
          this.createElement('li', { class: 'mobile-user-info' }, [
            this.createElement('strong', { class: 'user-name' }, [user?.name || 'User']),
            avatarElement,
          ]),
          this.createElement('li', {}, [
            this.createElement('a', { href: '/', 'data-link': '' }, ['Home'])
          ]),
          this.createElement('li', {}, [
            this.createElement('a', { href: '/about', 'data-link': '' }, ['About Us'])
          ]),
          this.createElement('li', {}, [
            this.createElement('a', { href: '/contact', 'data-link': '' }, ['Contact'])
          ]),
          this.createElement('li', {}, [
            this.createElement('a', {
              href: '/results',
              'data-link': ''
            }, ['Results'])
          ]),
        ])
      ]);

      const signOutButtonMobile = this.createElement('button', {
        class: 'sign-out mobile-sign-out',
        type: 'button',
        onclick: () => AuthService.logout()
      }, ['Sign Out']);

      aside.append(asideNav, signOutButtonMobile);

      asideNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          const clickedLink = e.target;
          clickedLink.classList.add('clicked');
          setTimeout(() => {
            clickedLink.classList.remove('clicked');
          }, 100);
          mobileMenu.classList.remove('active');
          document.body.style.overflow = '';
          const path = clickedLink.getAttribute('href');
          if (window.location.pathname !== path) {
            window.history.pushState({}, '', path);
          }
          window.dispatchEvent(new PopStateEvent('popstate'));
        });
      });

    } else {
      nav.appendChild(this.createElement('section', {}, [
        this.createElement('google-sign-in')
      ]));

      aside.appendChild(this.createElement('section', {}, [
        this.createElement('google-sign-in')
      ]));
    }

    shadow.querySelector('#hamburger').addEventListener('click', () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    shadow.querySelector('#close-menu').addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });

    document.addEventListener('click', e => {
      const composedPath = e.composedPath();
      if (
        mobileMenu.classList.contains('active') &&
        !composedPath.includes(mobileMenu) &&
        !composedPath.includes(shadow.querySelector('#hamburger'))
      ) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    shadow.querySelectorAll('[href][data-link]').forEach(link => {
      link.addEventListener('click', this.handleLinkClick.bind(this));
    });
  }

  handleLinkClick(e) {
    e.preventDefault();
    const targetLink = e.target.closest('a');
    if (targetLink) {
        const path = targetLink.getAttribute('href');
        if (path) {
            router.navigateTo(path);
            const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    const clickedLink = e.target;
    clickedLink.classList.add('clicked');
    setTimeout(() => {
      clickedLink.classList.remove('clicked');
    }, 100);
    const path = clickedLink.getAttribute('href');
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('app-header', AppHeader);
import { createElementAndAppend } from '../utils.js';
import { store } from '../state.js';
import { store } from '../state.js';
import { AuthService } from '../services/auth.js';
import { router } from '../router.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/app-header.css' }
});

const initialHeaderElement = createElementAndAppend(template.content, 'header');
createElementAndAppend(initialHeaderElement, 'h1', { props: { textContent: 'Employable' } });

const initialNavElement = createElementAndAppend(initialHeaderElement, 'nav');
const initialUlElement = createElementAndAppend(initialNavElement, 'ul');
const initialNavItems = [
  { href: '/', text: 'Home' },
  { href: '/about', text: 'About' },
  { href: '/contact', text: 'Contact' },
];
initialNavItems.forEach(item => {
  const liElement = createElementAndAppend(initialUlElement, 'li');
  createElementAndAppend(liElement, 'a', {
    attrs: { href: item.href, 'data-link': '' },
    props: { textContent: item.text }
  });
});

createElementAndAppend(initialHeaderElement, 'section', { props: { id: 'auth-container' } });

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

    createElementAndAppend(this.shadowRoot, 'link', {
      attrs: { rel: 'stylesheet', href: '/styles/components/app-header.css' }
    });

    const header = createElementAndAppend(this.shadowRoot, 'header');
    const headerContent = createElementAndAppend(header, 'section', { props: { className: 'header-content' } });

    createElementAndAppend(headerContent, 'a', {
      props: { href: '/', className: 'logo', textContent: 'Employability Assessment' },
      attrs: { 'data-link': '' }
    });

    const hamburgerButton = createElementAndAppend(headerContent, 'button', {
      props: { className: 'hamburger', id: 'hamburger' }
    });
    for (let i = 0; i < 3; i++) {
      createElementAndAppend(hamburgerButton, 'span');
    }

    const navLinksContainer = createElementAndAppend(headerContent, 'nav', { props: { className: 'nav-links' } });

    if (isAuthenticated) {
      createElementAndAppend(navLinksContainer, 'a', {
        props: { href: '/assessment', className: 'assessment-link', textContent: 'Assessment' },
        attrs: { 'data-link': '' }
      });
      createElementAndAppend(navLinksContainer, 'a', {
        props: { href: '/results', textContent: 'Results' },
        attrs: { 'data-link': '' }
      });

      const userInfoSection = createElementAndAppend(navLinksContainer, 'section', { props: { className: 'user-info' } });

      if (pictureUrl) {
        createElementAndAppend(userInfoSection, 'img', {
          props: {
            src: pictureUrl,
            alt: user?.name || 'User image',
            className: 'user-avatar'
          },
          callbacks: {
            error: function() {
              this.style.display = 'none';
              if (this.nextElementSibling && this.nextElementSibling.classList.contains('user-avatar-placeholder')) {
                this.nextElementSibling.style.display = 'flex';
              }
            }
          }
        });
        createElementAndAppend(userInfoSection, 'p', {
          props: {
            className: 'user-avatar-placeholder',
            textContent: user?.name?.charAt(0)?.toUpperCase() || 'G'
          },
          style: { display: 'none' }
        });
      } else {
        createElementAndAppend(userInfoSection, 'p', {
          props: {
            className: 'user-avatar-placeholder',
            textContent: user?.name?.charAt(0)?.toUpperCase() || 'G'
          }
        });
      }
      createElementAndAppend(userInfoSection, 'span', {
        props: { className: 'user-name', textContent: user?.name || 'User' }
      });
      createElementAndAppend(userInfoSection, 'span', {
        props: { className: 'sign-out', textContent: 'Sign Out' }
      });
    } else {
      createElementAndAppend(navLinksContainer, 'google-sign-in');
    }

    const mobileMenuSection = createElementAndAppend(this.shadowRoot, 'section', {
      props: { className: 'mobile-menu', id: 'mobile-menu' }
    });

    createElementAndAppend(mobileMenuSection, 'button', {
      props: { className: 'close-button', id: 'close-menu', textContent: '\u00D7' }
    });

    const mobileNavLinksContainer = createElementAndAppend(mobileMenuSection, 'nav', { props: { className: 'mobile-nav-links' } });

    if (isAuthenticated) {
      createElementAndAppend(mobileNavLinksContainer, 'a', {
        props: { href: '/assessment', className: 'assessment-link', textContent: 'Assessment' },
        attrs: { 'data-link': '' }
      });
      createElementAndAppend(mobileNavLinksContainer, 'a', {
        props: { href: '/results', textContent: 'Results' },
        attrs: { 'data-link': '' }
      });

      const mobileUserInfoSection = createElementAndAppend(mobileNavLinksContainer, 'section', { props: { className: 'user-info' } });
      if (pictureUrl) {
        createElementAndAppend(mobileUserInfoSection, 'img', {
          props: {
            src: pictureUrl,
            alt: user?.name || 'User',
            className: 'user-avatar'
          },
          callbacks: {
            error: function() {
              this.style.display = 'none';
              if (this.nextElementSibling && this.nextElementSibling.classList.contains('user-avatar-placeholder')) {
                this.nextElementSibling.style.display = 'flex';
              }
            }
          }
        });
        createElementAndAppend(mobileUserInfoSection, 'p', {
          props: {
            className: 'user-avatar-placeholder',
            textContent: user?.name?.charAt(0)?.toUpperCase() || 'G'
          },
          style: { display: 'none' }
        });
      } else {
        createElementAndAppend(mobileUserInfoSection, 'p', {
          props: {
            className: 'user-avatar-placeholder',
            textContent: user?.name?.charAt(0)?.toUpperCase() || 'G'
          }
        });
      }
      createElementAndAppend(mobileUserInfoSection, 'span', {
        props: { className: 'user-name', textContent: user?.name || 'User' }
      });
      createElementAndAppend(mobileUserInfoSection, 'span', {
        props: { className: 'sign-out', textContent: 'Sign Out' }
      });
    } else {
      createElementAndAppend(mobileNavLinksContainer, 'google-sign-in');
    }

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
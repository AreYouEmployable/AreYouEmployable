import { store } from '../state.js';
import { AuthService } from '../services/auth.js';

class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
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
        { href: '/history', text: 'Assessment History' },
        { href: '/contact', text: 'Contact' },
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
            this.createElement('a', { href: '/history', 'data-link': '' }, ['Assignment History'])
          ]),
          this.createElement('li', {}, [
            this.createElement('a', { href: '/contact', 'data-link': '' }, ['Contact'])
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
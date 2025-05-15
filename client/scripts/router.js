import { store } from './state.js';

class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this.init();

    document.addEventListener('start-assessment', () => {
      this.navigateTo('/assessment');
    });
  }

  init() {
    window.addEventListener('popstate', (event) => {
      this.handleRouting();
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const path = link.pathname;
        this.navigateTo(path);
      }
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.handleRouting());
    } else {
      this.handleRouting();
    }
  }

  handleRouting() {
    const path = window.location.pathname || '/';
    let targetRoute = this.routes.find(r => r.path === path);

    if (!targetRoute) {
      targetRoute = this.routes.find(r => r.path === '*');
    }

    if (!targetRoute) {
      targetRoute = this.routes.find(r => r.path === '/');
      if (targetRoute) {
        console.warn(`Router: No specific route or wildcard route found for "${path}". Defaulting to home '/'.`);
      } else {
        console.error(`Router: CRITICAL - No route found for path "${path}", and no wildcard '*' or home '/' route is configured.`);
        this.displayErrorInAppMain('Error: Application routing is not configured correctly.', 'Please define a home ("/") or wildcard ("*") route.');
        return;
      }
    }

    if (targetRoute.protected && !this.isAuthenticated()) {
      const forbiddenRoute = this.routes.find(r => r.path === '/forbidden');
      if (forbiddenRoute) {
        targetRoute = forbiddenRoute;
      } else {
        console.error("Router: Forbidden route accessed but no '/forbidden' path is configured.");
        this.displayErrorInAppMain('Error: Access Forbidden', 'And no forbidden page is configured.');
        return;
      }
    }

    if (this.currentRoute === targetRoute) {
      return;
    }

    this.currentRoute = targetRoute;
    this.loadComponent(targetRoute.component, targetRoute.data);
    
    document.title = targetRoute.data?.title ? `${targetRoute.data.title} - Are you employable` : 'Are you employable';
  }

  displayErrorInAppMain(titleText, messageText = '') {
    const appMain = document.querySelector('app-main');
    if (appMain) {
      appMain.setAttribute('data-component', 'error-page');
      appMain.setAttribute('data-props', JSON.stringify({
        'error-title': titleText,
        'error-message': messageText
      }));
    }
  }

  isAuthenticated() {
    const state = store.getState();
    return state.auth?.isAuthenticated || false;
  }

  loadComponent(componentName, data = {}) {
    const appMain = document.querySelector('app-main');
    if (appMain) {
      appMain.setAttribute('data-component', componentName);
      appMain.setAttribute('data-props', JSON.stringify(data));
    } else {
      console.error("Router: <app-main> element not found in the DOM. Cannot load component:", componentName);
    }
  }

  navigateTo(path, data = {}) {
    if (window.location.pathname !== path) {
      window.history.pushState(data, '', path);
    }
    this.handleRouting();
  }
}

const routes = [
  { path: '/', component: 'home-page', data: { title: 'Welcome Home' } },
  { path: '/about', component: 'about-page', data: { title: 'About Us' } },
  { path: '/contact', component: 'contact-page', data: { title: 'Contact Us' } },
  { path: '/assessment', component: 'assessment-page', data: { title: 'Assessment' }, protected: true },
  { path: '/forbidden', component: 'forbidden-page', data: { title: 'Access Denied' } },
  { path: '/results', component: 'results-page', data: { title: 'Results' } },
  { path: '/history', component: 'assessment-history', data: { title: 'Assessment History' } },
  { path: '*', component: 'not-found-page', data: { title: '404 Not Found' } }
];

export const router = new Router(routes);

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
    window.addEventListener('popstate', () => this.handleRouting());

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.handleRouting());
    } else {
      this.handleRouting();
    }
  }

  displayErrorInAppMain(titleText, messageText = '') {
    const appMain = document.querySelector('app-main');
    if (appMain) {
      // Clear previous content using DOM manipulation
      while (appMain.firstChild) {
        appMain.removeChild(appMain.firstChild);
      }

      const h1 = document.createElement('h1');
      h1.textContent = titleText;
      appMain.appendChild(h1);

      if (messageText) {
        const p = document.createElement('p');
        p.textContent = messageText;
        appMain.appendChild(p);
      }
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
        // This now calls the updated displayErrorInAppMain
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
        // This also calls the updated displayErrorInAppMain
        this.displayErrorInAppMain('Error: Access Forbidden', 'And no forbidden page is configured.');
        return;
      }
    }

    if (this.currentRoute === targetRoute) {
      return;
    }

    this.currentRoute = targetRoute;
    this.loadComponent(targetRoute.component, targetRoute.data);
  }

  isAuthenticated() {
    const state = store.getState();
    return state.auth?.isAuthenticated || false;
  }

  loadComponent(componentName, data = {}) {
    const appMain = document.querySelector('app-main');
    if (appMain) {
      // If app-main itself needs clearing before attributes are set,
      // and it doesn't handle its own content replacement based on attribute changes,
      // you might clear it here too. For now, assuming app-main re-renders based on attributes.
      // Example:
      // if (componentName !== 'error-page' && componentName !== 'forbidden-page') { // Avoid re-clearing if an error was just shown
      //   while (appMain.firstChild) {
      //     appMain.removeChild(appMain.firstChild);
      //   }
      // }
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
  { path: '/forbidden', component: 'forbidden-page', data: { title: 'Access Forbidden' } },
  { path: '/results', component: 'results-page', data: { title: 'Results' }, protected: true },
  { path: '*', component: 'not-found-page', data: { title: '404 Not Found' } }
];

export const router = new Router(routes);

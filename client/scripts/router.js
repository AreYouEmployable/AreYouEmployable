import { store } from './state.js';

class Router {
  constructor(routes) {
      this.routes = routes;
      this.currentRoute = null;
      this.init();
      
      // Listen for assessment start event
      document.addEventListener('start-assessment', () => {
          this.navigateTo('/assessment');
      });
  }

  init() {
      // Handle browser back/forward buttons
      window.addEventListener('popstate', () => this.handleRouting());
      
      // Handle direct URL navigation
      window.addEventListener('load', () => this.handleRouting());
      
      // Handle hash changes
      window.addEventListener('hashchange', () => this.handleRouting());

      // Initial route handling
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
              const appMain = document.querySelector('app-main');
              if (appMain) {
                  appMain.innerHTML = '<h1>Error: Application routing is not configured correctly. Please define a home ("/") or wildcard ("*") route.</h1>';
              }
              return;
          }
      }

      // Check if route is protected and user is not authenticated
      if (targetRoute.protected && !this.isAuthenticated()) {
          targetRoute = this.routes.find(r => r.path === '/forbidden');
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
          appMain.setAttribute('data-component', componentName);
          appMain.setAttribute('data-props', JSON.stringify(data));
      } else {
          console.error("Router: <app-main> element not found in the DOM. Cannot load component:", componentName);
      }
  }

  navigateTo(path, data = {}) {
      const route = this.routes.find(r => r.path === path);
      if (route) {
          if (window.location.pathname !== path) {
              window.history.pushState({}, '', path);
          }
          this.handleRouting();
      } else {
          console.warn(`Router: Attempted to navigate to an undefined path "${path}". Will try to resolve with wildcard/fallback.`);
          window.history.pushState({}, '', path);
          this.handleRouting();
      }
  }
}

const routes = [
  { path: '/', component: 'home-page', data: { title: 'Welcome Home' } },
  { path: '/about', component: 'about-page', data: { title: 'About Us' } },
  { path: '/contact', component: 'contact-page', data: { title: 'Contact Us' } },
  { path: '/assessment', component: 'assessment-page', data: { title: 'Assessment' }, protected: true },
  { path: '/forbidden', component: 'forbidden-page', data: { title: '' } },
  { path: '*', component: 'not-found-page', data: { title: '' } },
  { path: '/results', component: 'results-page', data: { title: 'Results' } },
  {path: '/assessment', component: 'assessment-page', data: { title: 'Assessment' } },
  { path: '/history', component: 'assessment-history', data: { title: 'Assessment History' } },
  { path: '*', component: 'not-found-page', data: { title: '404 Not Found' } }
];

export const router = new Router(routes);
class Router {
    constructor(routes) {
      this.routes = routes;
      this.currentRoute = null;
      this.init();
    }
  
    init() {
      window.addEventListener('popstate', () => this.handleRouting());
      document.addEventListener('DOMContentLoaded', () => this.handleRouting());
    }
  
    handleRouting() {
      const path = window.location.pathname || '/';
      const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
      
      if (this.currentRoute === route) return;
      
      this.currentRoute = route;
      this.loadComponent(route.component, route.data);
    }
  
    loadComponent(componentName, data = {}) {
      const appMain = document.querySelector('app-main');
      if (appMain) {
        appMain.setAttribute('data-component', componentName);
        appMain.setAttribute('data-props', JSON.stringify(data));
      }
    }
  
    navigateTo(path, data = {}) {
      const route = this.routes.find(r => r.path === path);
      if (route) {
        window.history.pushState({}, '', path);
        this.handleRouting();
      }
    }
  }
  
  const routes = [
    { path: '/', component: 'home-page', data: { title: 'Welcome Home' } },
    { path: '/about', component: 'about-page', data: { title: 'About Us' } },
    { path: '/contact', component: 'contact-page', data: { title: 'Contact Us' } },
    
    { path: '*', component: 'not-found-page', data: { title: '404 Not Found' } }
  ];
  
  export const router = new Router(routes);
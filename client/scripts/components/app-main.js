import { router } from '../router.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/app-main.css">
  <main></main>
`;

class AppMain extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.mainElement = this.shadowRoot.querySelector('main');
  }

  static get observedAttributes() {
    return ['data-component', 'data-props'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-component' && newValue !== oldValue) {
      this.loadComponent();
    }
  }

  loadComponent() {
    const componentName = this.getAttribute('data-component');
    const props = JSON.parse(this.getAttribute('data-props') || '{}');
    
    if (!componentName) return;
    
    this.mainElement.innerHTML = '';
    const component = document.createElement(componentName);
    
    Object.entries(props).forEach(([key, value]) => {
      component.setAttribute(key, value);
    });
    
    this.mainElement.appendChild(component);
  }
}

customElements.define('app-main', AppMain);
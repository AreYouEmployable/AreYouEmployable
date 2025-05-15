const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/app-main.css');
template.content.appendChild(stylesheetLink);

const mainElement = document.createElement('main');
template.content.appendChild(mainElement);

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
    const dataPropsAttribute = this.getAttribute('data-props');
    let props = {};

    if (!componentName) {
        console.warn('AppMain: data-component attribute is missing. Cannot load component.');
        return;
    }

    try {
      if (dataPropsAttribute) {
        props = JSON.parse(dataPropsAttribute);
      }
    } catch (e) {
      console.error(
        'AppMain: Error parsing data-props JSON for component', componentName + '.',
        'Attribute value:', dataPropsAttribute,
        'Error:', e
      );
    }
    
    this.mainElement.innerHTML = '';
    
    try {
      const component = document.createElement(componentName);
      this.mainElement.appendChild(component);
      
      // Set attributes after the element is in the DOM
      Object.entries(props).forEach(([key, value]) => {
        if (typeof value === 'object' || typeof value === 'boolean') {
          component.setAttribute(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        } else {
          component.setAttribute(key, value);
        }
      });
    } catch (error) {
      console.error('AppMain: Error creating component:', error);
      this.mainElement.innerHTML = `<section class="error">Failed to load component: ${componentName}</section>`;
    }
  }
}

customElements.define('app-main', AppMain);
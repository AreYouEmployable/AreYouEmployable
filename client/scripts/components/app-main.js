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
    if ((name === 'data-component' && newValue !== oldValue) || (name === 'data-props' && newValue !== oldValue)) {
      this.loadComponent();
    }
  }

  loadComponent() {
    const componentName = this.getAttribute('data-component');
    const dataPropsAttribute = this.getAttribute('data-props');
    let props = {};

    if (!componentName) {
      console.warn('AppMain: data-component attribute is missing. Cannot load component.');
      while (this.mainElement.firstChild) {
        this.mainElement.removeChild(this.mainElement.firstChild);
      }
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

    while (this.mainElement.firstChild) {
      this.mainElement.removeChild(this.mainElement.firstChild);
    }

    try {
      const component = document.createElement(componentName);

      if (typeof props === 'object' && props !== null) {
        Object.entries(props).forEach(([key, value]) => {
          if (typeof value === 'object') {
            component.setAttribute(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            component.setAttribute(key, String(value));
          } else {
            component.setAttribute(key, value);
          }
        });
      }
      
      this.mainElement.appendChild(component);

    } catch (error) {
      console.error('AppMain: Error creating component:', componentName, error);
      const errorSection = document.createElement('section');
      errorSection.classList.add('error');
      errorSection.textContent = `Failed to load component: ${componentName}`;
      this.mainElement.appendChild(errorSection);
    }
  }
}

customElements.define('app-main', AppMain);

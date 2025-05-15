export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {};
    this._props = {};
  }

  // Lifecycle methods
  connectedCallback() {
    this.render();
    this.afterRender();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  // State management
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.render();
  }

  getState() {
    return this._state;
  }

  // Props management
  setProps(props) {
    this._props = { ...this._props, ...props };
    this.render();
  }

  getProps() {
    return this._props;
  }

  // Template and rendering
  getTemplate() {
    throw new Error('getTemplate() must be implemented by subclass');
  }

  render() {
    const template = this.getTemplate();
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  // Hooks
  afterRender() {
    // Override in subclass if needed
  }

  cleanup() {
    // Override in subclass if needed
  }

  // Utility methods
  dispatchCustomEvent(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  querySelector(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.shadowRoot.querySelectorAll(selector);
  }
} 
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = {};
    this._props = {};
  }

  connectedCallback() {
    this.render();
    this.afterRender();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  setState(newState) {
    this._state = { ...this._state, ...newState };
    this.render();
  }

  getState() {
    return this._state;
  }

  setProps(props) {
    this._props = { ...this._props, ...props };
    this.render();
  }

  getProps() {
    return this._props;
  }

  getTemplate() {
    throw new Error('getTemplate() must be implemented by subclass');
  }

  render() {
    const template = this.getTemplate();
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  afterRender() {
  }

  cleanup() {
  }

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
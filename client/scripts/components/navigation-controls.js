import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/navigation-controls.css' }
});

const navElement = createElementAndAppend(template.content, 'nav', {
  props: { className: 'navigation-controls' },
  attrs: { 'aria-label': 'Scenario navigation' }
});

createElementAndAppend(navElement, 'button', {
  props: {
    id: 'prev-btn',
    className: 'nav-button prev-button',
    disabled: true,
    textContent: 'Previous'
  },
  attrs: { type: 'button' }
});

createElementAndAppend(navElement, 'button', {
  props: {
    id: 'next-btn',
    className: 'nav-button next-button',
    disabled: true,
    textContent: 'Next'
  },
  attrs: { type: 'button' }
});

class NavigationControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.nextButton = this.shadowRoot.getElementById('next-btn');
    this.prevButton = this.shadowRoot.getElementById('prev-btn');
    this._canGoForward = false;
    this._canGoBack = false;
    this._isLastScenario = false;
  }

  connectedCallback() {
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('navigate', {
          detail: { direction: 'prev' },
          bubbles: true,
          composed: true
        }));
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('navigate', {
          detail: { direction: 'next' },
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  set canGoBack(value) {
    this._canGoBack = value;
    if (this.prevButton) {
        this.prevButton.disabled = !value;
    }
  }

  set canGoForward(value) {
    this._canGoForward = value;
    if (this.nextButton) {
        this.nextButton.disabled = !value;
    }
    this._updateNextButtonText();
  }

  set isLastScenario(value) {
    this._isLastScenario = value;
    this._updateNextButtonText();
  }

  _updateNextButtonText() {
    if (this.nextButton) {
        this.nextButton.textContent = this._isLastScenario ? 'Finish Assessment' : 'Next';
        this.nextButton.disabled = !this._canGoForward;
    }
  }

  get canGoForward() {
    return this._canGoForward;
  }

  get canGoBack() {
    return this._canGoBack;
  }

  get isLastScenario() {
    return this._isLastScenario;
  }
}

customElements.define('navigation-controls', NavigationControls);

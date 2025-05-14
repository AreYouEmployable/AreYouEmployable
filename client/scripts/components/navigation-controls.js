const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/navigation-controls.css">
  <nav class="navigation-controls" aria-label="Scenario navigation">
    <button id="next-btn" class="nav-button next-button" disabled type="button">Next</button>
  </nav>
`;

class NavigationControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.nextButton = this.shadowRoot.getElementById('next-btn');
    this._canGoForward = false;
    this._isLastScenario = false;
  }

  connectedCallback() {
    this.nextButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { direction: 'next' },
        bubbles: true,
        composed: true
      }));
    });
  }

  set canGoForward(value) {
    this._canGoForward = value;
    this.nextButton.disabled = !value;
    this._updateNextButtonText();
  }

  set isLastScenario(value) {
    this._isLastScenario = value;
    this._updateNextButtonText();
  }

  _updateNextButtonText() {
    this.nextButton.textContent = this._isLastScenario ? 'Finish Assessment' : 'Next';
    this.nextButton.disabled = !this._canGoForward;
  }

  get canGoForward() {
    return this._canGoForward;
  }

  get isLastScenario() {
    return this._isLastScenario;
  }
}

customElements.define('navigation-controls', NavigationControls);

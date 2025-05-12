const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/navigation-controls.css">
  <nav class="navigation-controls" aria-label="Scenario navigation">
    <button id="prev-btn" class="nav-button prev-button" disabled type="button">Previous</button>
    <button id="next-btn" class="nav-button next-button" disabled type="button">Next</button>
  </nav>
`;

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
    this.prevButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { direction: 'prev' },
        bubbles: true,
        composed: true
      }));
    });

    this.nextButton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { direction: 'next' },
        bubbles: true,
        composed: true
      }));
    });
  }

  set canGoBack(value) {
    this._canGoBack = value;
    this.prevButton.disabled = !value;
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

  get canGoBack() {
    return this._canGoBack;
  }

  get isLastScenario() {
    return this._isLastScenario;
  }
}

customElements.define('navigation-controls', NavigationControls);

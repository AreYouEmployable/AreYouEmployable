const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/navigation-controls.css">
  <div class="navigation-controls">
    <button id="prev-btn" class="nav-button prev-button" disabled>Previous</button>
    <button id="next-btn" class="nav-button next-button" disabled>Next</button>
  </div>
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
    if (this._isLastScenario) {
      this.nextButton.textContent = 'Finish Assessment';
    } else {
      this.nextButton.textContent = 'Next';
    }
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

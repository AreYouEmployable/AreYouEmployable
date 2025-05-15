const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/navigation-controls.css');
template.content.appendChild(stylesheetLink);

const navElement = document.createElement('nav');
navElement.classList.add('navigation-controls');
navElement.setAttribute('aria-label', 'Scenario navigation');

const prevButton = document.createElement('button');
prevButton.id = 'prev-btn';
prevButton.classList.add('nav-button', 'prev-button');
prevButton.disabled = true;
prevButton.setAttribute('type', 'button');
prevButton.textContent = 'Previous';
navElement.appendChild(prevButton);

const nextButton = document.createElement('button');
nextButton.id = 'next-btn';
nextButton.classList.add('nav-button', 'next-button');
nextButton.disabled = true;
nextButton.setAttribute('type', 'button');
nextButton.textContent = 'Next';
navElement.appendChild(nextButton);

template.content.appendChild(navElement);

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

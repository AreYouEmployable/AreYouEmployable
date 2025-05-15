const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/_progress-bar.css');
template.content.appendChild(stylesheetLink);

const progressContainerSection = document.createElement('section');
progressContainerSection.classList.add('progress-container');

const progressBarSection = document.createElement('section');
progressBarSection.classList.add('progress-bar');
progressBarSection.id = 'bar';
progressBarSection.textContent = '0%';
progressContainerSection.appendChild(progressBarSection);

template.content.appendChild(progressContainerSection);

const tempContainer = document.createElement('section');
tempContainer.appendChild(template.content.cloneNode(true));

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.current = 0;
    this.total = parseInt(this.getAttribute('total')) || 5;
  }

  static get observedAttributes() {
    return ['total'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'total' && oldValue !== newValue) {
      this.total = parseInt(newValue) || 5;
      this.updateBar();
    }
  }

  connectedCallback() {
    this.updateBar();
  }

  nextStep() {
    if (this.current < this.total) {
      this.current++;
      this.updateBar();
    }
  }

  previousStep() {
    if (this.current > 0) {
      this.current--;
      this.updateBar();
    }
  }

  updateBar() {
    const percent = Math.round((this.current / this.total) * 100);
    const bar = this.shadowRoot.getElementById('bar');
    bar.style.width = `${percent}%`;
    bar.textContent = `${percent}%`;
    
    this.dispatchEvent(new CustomEvent('progress-update', {
      detail: { current: this.current, total: this.total, percent },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('progress-bar', ProgressBar);

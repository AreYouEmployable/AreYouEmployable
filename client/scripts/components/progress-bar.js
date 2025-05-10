const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/progress-bar.css">
  <section class="progress-container">
    <div class="progress-bar" id="bar">0%</div>
  </section>
`;

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
    
    // Dispatch event for progress update
    this.dispatchEvent(new CustomEvent('progress-update', {
      detail: { current: this.current, total: this.total, percent },
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('progress-bar', ProgressBar);

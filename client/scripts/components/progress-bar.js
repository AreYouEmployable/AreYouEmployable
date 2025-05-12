const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/progress-bar.css">
  <section class="progress-container">
    <progress class="progress-bar" id="bar" value="0" max="100">0%</progress>
    <div class="progress-text-end">0%</div>
  </section>
`;

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.current = 0;
    this.total = parseInt(this.getAttribute('total')) || 5;
    this.textPosition = this.getAttribute('text-position') || 'start';
  }

  static get observedAttributes() {
    return ['total', 'text-position'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'total' && oldValue !== newValue) {
      this.total = parseInt(newValue) || 5;
      this.updateBar();
    } else if (name === 'text-position' && oldValue !== newValue) {
      this.textPosition = newValue;
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
    const textEnd = this.shadowRoot.querySelector('.progress-text-end');

    bar.value = percent;

    if (this.textPosition === 'end') {
      bar.textContent = ''; 
      textEnd.textContent = `${percent}%`;
      textEnd.style.display = 'block';
    } else {
      bar.textContent = `${percent}%`;
      textEnd.style.display = 'none';
    }

    this.dispatchEvent(new CustomEvent('progress-update', {
      detail: { current: this.current, total: this.total, percent },
      bubbles: true,
      composed: true
    }));

    this.togglePulseAnimation(percent);
  }

  togglePulseAnimation(percent) {
    const progressBarElement = this.shadowRoot.querySelector('.progress-bar');
    if (percent === 0) {
      progressBarElement.style.animation = 'none';
    } else if (!progressBarElement.style.animation) {
      progressBarElement.style.animation = 'progress-pulse 1s ease-out';
    }
  }
}

customElements.define('progress-bar', ProgressBar);

import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/progress-bar.css' }
});

const progressContainerSection = createElementAndAppend(template.content, 'section', {
  props: { className: 'progress-container' }
});

createElementAndAppend(progressContainerSection, 'progress', {
  props: { className: 'progress-bar', id: 'bar' },
  attrs: { value: '0', max: '100' }
});

createElementAndAppend(progressContainerSection, 'section', {
  props: {
    className: 'progress-text',
    id: 'progress-text',
    textContent: '0%'
  }
});

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
    return ['total', 'text-position', 'value', 'current'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'total' && oldValue !== newValue) {
      this.total = parseInt(newValue) || 5;
      this.updateBar();
    } else if (name === 'text-position' && oldValue !== newValue) {
      this.textPosition = newValue;
      this.updateBar();
    } else if ((name === 'value' || name === 'current') && oldValue !== newValue) {
      this.current = parseInt(newValue) || 0;
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
    const percent = this.total > 0 ? Math.round((this.current / this.total) * 100) : 0;
    const bar = this.shadowRoot.getElementById('bar');
    const progressText = this.shadowRoot.getElementById('progress-text');

    if (bar) {
        bar.value = percent;
        bar.max = 100;
    }
    if (progressText) {
        progressText.textContent = `${percent}%`;
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
    if (!progressBarElement) return;

    if (percent === 0) {
      progressBarElement.style.animation = 'none';
    } else if (progressBarElement.style.animation === 'none' || !progressBarElement.style.animation) {
      progressBarElement.style.animation = 'progress-pulse 1s ease-out';
    }
  }
}

customElements.define('progress-bar', ProgressBar);

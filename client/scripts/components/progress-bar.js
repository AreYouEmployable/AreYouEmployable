const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/progress-bar.css');
template.content.appendChild(stylesheetLink);

const progressContainerSection = document.createElement('section');
progressContainerSection.classList.add('progress-container');

const progressBarElement = document.createElement('progress');
progressBarElement.classList.add('progress-bar');
progressBarElement.id = 'bar';
progressBarElement.setAttribute('value', '0');
progressBarElement.setAttribute('max', '100');
progressContainerSection.appendChild(progressBarElement);

const progressTextDiv = document.createElement('div');
progressTextDiv.classList.add('progress-text');
progressTextDiv.id = 'progress-text';
progressTextDiv.textContent = '0%';
progressContainerSection.appendChild(progressTextDiv);

template.content.appendChild(progressContainerSection);

const tempDiv = document.createElement('section');
tempDiv.appendChild(template.content.cloneNode(true));

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
    const percent = Math.round((this.current / this.total) * 100);
    const bar = this.shadowRoot.getElementById('bar');
    const progressText = this.shadowRoot.getElementById('progress-text');
    
    bar.value = percent;
    bar.max = 100;
    progressText.textContent = `${percent}%`;

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

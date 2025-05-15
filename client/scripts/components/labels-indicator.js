import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: 'styles/components/labels-indicator.css' }
});

createElementAndAppend(template.content, 'ul', {
  props: { className: 'labels-container' },
  attrs: { role: 'list' }
});

class LabelsIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.labelsContainer = this.shadowRoot.querySelector('.labels-container');
    this._labels = [];
    this._difficulty = '';
  }

  static get observedAttributes() {
    return ['labels', 'difficulty'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'labels' && oldValue !== newValue) {
      try {
        this._labels = JSON.parse(newValue);
      } catch {
        this._labels = [];
      }
      this.render();
    } else if (name === 'difficulty' && oldValue !== newValue) {
      this._difficulty = newValue ? newValue.toLowerCase() : '';
      this.updateLabelColors();
    }
  }

  connectedCallback() {
    if (this.hasAttribute('labels')) {
        try {
            const parsedLabels = JSON.parse(this.getAttribute('labels'));
            if (Array.isArray(parsedLabels)) {
                this._labels = parsedLabels;
            } else {
                this._labels = [];
            }
        } catch {
            this._labels = [];
        }
    } else {
        this._labels = [];
    }

    if (this.hasAttribute('difficulty')) {
        this._difficulty = (this.getAttribute('difficulty') || '').toLowerCase();
    } else {
        this._difficulty = '';
    }
    this.render();
  }

  render() {
    if (!this.labelsContainer) return;

    while (this.labelsContainer.firstChild) {
      this.labelsContainer.removeChild(this.labelsContainer.firstChild);
    }

    this._labels.forEach((label) => {
      createElementAndAppend(this.labelsContainer, 'li', {
        props: { textContent: label },
        classList: ['label']
      });
    });
    this.updateLabelColors();
  }

  updateLabelColors() {
    if (!this.labelsContainer) return;
    const labelElements = this.shadowRoot.querySelectorAll('.label');
    labelElements.forEach((labelElement, index) => {
      labelElement.classList.remove('easy', 'medium', 'hard', 'technical', 'culture-fit', 'scenario-type');

      if (index === 1) {
        if (this._difficulty && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
          labelElement.classList.add(this._difficulty);
        }
      } else if (index === 0) {
        labelElement.classList.add('scenario-type');
        const labelText = this._labels[0];
        if (labelText === 'Technical') {
          labelElement.classList.add('technical');
        } else if (labelText === 'Culture Fit') {
          labelElement.classList.add('culture-fit');
        }
      }
    });
  }
}

customElements.define('labels-indicator', LabelsIndicator);

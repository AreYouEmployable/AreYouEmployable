const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', 'styles/components/labels-indicator.css');
template.content.appendChild(stylesheetLink);

const ulElement = document.createElement('ul');
ulElement.classList.add('labels-container');
ulElement.setAttribute('role', 'list');
template.content.appendChild(ulElement);

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
        this.render();
      } catch {
        this._labels = [];
        this.render();
      }
    } else if (name === 'difficulty' && oldValue !== newValue) {
      this._difficulty = newValue ? newValue.toLowerCase() : '';
      this.updateLabelColors();
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('labels') && this._labels.length === 0) {
    }
    if (this.hasAttribute('labels') && !this._labels.length) { 
        try {
            this._labels = JSON.parse(this.getAttribute('labels'));
        } catch {
            this._labels = [];
        }
    }
    if (this.hasAttribute('difficulty') && !this._difficulty) {
        this._difficulty = (this.getAttribute('difficulty') || '').toLowerCase();
    }
    this.render();
  }

  render() {
    if (!this.labelsContainer) return;

    while (this.labelsContainer.firstChild) {
      this.labelsContainer.removeChild(this.labelsContainer.firstChild);
    }

    this._labels.forEach((label, index) => {
      const item = document.createElement('li');
      item.classList.add('label');
      item.textContent = label;
      this.labelsContainer.appendChild(item);
      if (index === 1 && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
        item.classList.add(this._difficulty);
      }
      if (index === 0) {
        item.classList.add('scenario-type');
        if (label === 'Technical') {
            item.classList.add('technical');
        } else if (label === 'Culture Fit') {
            item.classList.add('culture-fit');
        }
      }
    });
    this.updateLabelColors(); 
  }

  updateLabelColors() {
    if (!this.labelsContainer) return;
    const labelElements = this.shadowRoot.querySelectorAll('.label');
    labelElements.forEach((labelElement, index) => {
      if (index === 1) { 
        labelElement.classList.remove('easy', 'medium', 'hard');
        if (this._difficulty && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
          labelElement.classList.add(this._difficulty);
        }
      } else if (index === 0) { 
        labelElement.classList.remove('technical', 'culture-fit');
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

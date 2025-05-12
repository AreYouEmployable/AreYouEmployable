const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="styles/components/labels-indicator.css">
  <div class="labels-container">
    <span class="label scenario-type"></span>
    <span class="label difficulty"></span>
  </div>
`;

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
      } catch (error) {
        console.error('Invalid JSON for labels attribute:', error);
        this._labels = [];
        this.render();
      }
    } else if (name === 'difficulty' && oldValue !== newValue) {
      this._difficulty = newValue ? newValue.toLowerCase() : '';
      this.updateLabelColors();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.labelsContainer.innerHTML = '';
    this._labels.forEach((label, index) => {
      const labelElement = document.createElement('span');
      labelElement.classList.add('label');
      labelElement.textContent = label;
      this.labelsContainer.appendChild(labelElement);
      if (index === 1 && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
        labelElement.classList.add(this._difficulty);
      }
      if (index === 0) {
        labelElement.classList.add('scenario-type');
      }
    });
    this.updateLabelColors();
  }

  updateLabelColors() {
    const labelElements = this.shadowRoot.querySelectorAll('.label');
    labelElements.forEach((labelElement, index) => {
      if (index === 1) {
        labelElement.classList.remove('easy', 'medium', 'hard', 'difficulty');
        if (this._difficulty) {
          labelElement.classList.add(this._difficulty);
        }
      } else if (index === 0) {
        labelElement.className = 'label scenario-type'; 
        if (this._labels[0] === 'Technical') {
          labelElement.classList.add('technical');
        } else if (this._labels[0] === 'Culture Fit') {
          labelElement.classList.add('culture-fit');
        }
        // Add more conditions for other scenario types if needed
      }
    });
  }
}

customElements.define('labels-indicator', LabelsIndicator);
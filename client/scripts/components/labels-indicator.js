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
      this.updateLabelColors(); // Call updateLabelColors which will re-apply classes
    }
  }

  connectedCallback() {
    // Initial render based on attributes already set or default values
    if (!this.hasAttribute('labels') && this._labels.length === 0) {
        // If no labels attribute, ensure it renders if there are default _labels (though unlikely here)
        // or simply rely on attributeChangedCallback if attributes are set after connection.
    }
    // It's common to call render here if attributes might already be set.
    // However, attributeChangedCallback will also call render if 'labels' changes.
    // To ensure initial render if attributes are present at connection:
    if (this.hasAttribute('labels') && !this._labels.length) { // If labels attr exists but _labels not parsed yet
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

    // Clear previous labels using DOM manipulation
    while (this.labelsContainer.firstChild) {
      this.labelsContainer.removeChild(this.labelsContainer.firstChild);
    }

    this._labels.forEach((label, index) => {
      const item = document.createElement('li');
      item.classList.add('label');
      item.textContent = label;
      this.labelsContainer.appendChild(item);
      // Initial class setting based on current _difficulty and label type
      // This will be further refined by updateLabelColors
      if (index === 1 && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
        item.classList.add(this._difficulty);
      }
      if (index === 0) {
        item.classList.add('scenario-type');
        // Add specific type class if applicable (e.g., technical, culture-fit)
        // This logic is also in updateLabelColors, ensuring consistency
        if (label === 'Technical') {
            item.classList.add('technical');
        } else if (label === 'Culture Fit') {
            item.classList.add('culture-fit');
        }
      }
    });
    this.updateLabelColors(); // Ensure colors are correct after adding new items
  }

  updateLabelColors() {
    if (!this.labelsContainer) return;
    const labelElements = this.shadowRoot.querySelectorAll('.label');
    labelElements.forEach((labelElement, index) => {
      if (index === 1) { // Difficulty label
        // Remove previous difficulty classes before adding the new one
        labelElement.classList.remove('easy', 'medium', 'hard');
        if (this._difficulty && ['easy', 'medium', 'hard'].includes(this._difficulty)) {
          labelElement.classList.add(this._difficulty);
        }
      } else if (index === 0) { // Type label
        // Reset general type classes and add specific ones
        labelElement.classList.remove('technical', 'culture-fit'); // Remove specific type classes
        labelElement.classList.add('scenario-type'); // Ensure base class is present

        const labelText = this._labels[0]; // Get the text of the first label
        if (labelText === 'Technical') {
          labelElement.classList.add('technical');
        } else if (labelText === 'Culture Fit') {
          labelElement.classList.add('culture-fit');
        }
        // Add more conditions for other types if needed
      }
    });
  }
}

customElements.define('labels-indicator', LabelsIndicator);

// answer-option.js

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/answer-option.css"> <label class="option-box">
    <input type="radio" name="answer-group" /> <span id="labelText" class="label-text">Answer option</span>
    </label>
`;

class AnswerOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._inputElement = this.shadowRoot.querySelector('input');
    this._labelTextElement = this.shadowRoot.querySelector('#labelText');
  }

  // --- Observed Attributes ---
  static get observedAttributes() {
    return ['name', 'option-id', 'label', 'selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name') {
      this._inputElement.name = newValue;
    } else if (name === 'option-id') {
      this._inputElement.value = newValue; // Radio buttons use value for their unique ID in a group
    } else if (name === 'label' && this.text === 'Answer option') { // Only set if text not already set by property
        // If you want label to be part of the display, you might combine it with 'text'
        // For now, assuming 'text' property is the primary way to set the display value.
        // this.text = `${newValue}: ${this.text}`; // Example: "A: Option Value"
    } else if (name === 'selected') {
        // This handles programmatic changes to the 'selected' attribute
        const isSelected = newValue !== null && newValue !== 'false';
        if (this._inputElement.checked !== isSelected) {
            this._inputElement.checked = isSelected;
        }
        // Ensure the attribute reflects the property state if changed programmatically
        if (isSelected && !this.hasAttribute('selected')) {
            super.setAttribute('selected', 'true');
        } else if (!isSelected && this.hasAttribute('selected')) {
            super.removeAttribute('selected');
        }
    }
  }

  // --- Properties ---
  get text() {
    return this._labelTextElement.textContent;
  }

  set text(val) {
    this._labelTextElement.textContent = val;
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(val) {
    this.setAttribute('label', val);
    // Potentially update display text if label is part of it
  }

  get optionId() {
    return this.getAttribute('option-id');
  }

  set optionId(val) {
    this.setAttribute('option-id', val);
  }
  
  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    this.setAttribute('name', val);
  }

  get selected() {
    // The source of truth for 'selected' is the host attribute,
    // which should be in sync with the internal radio button's 'checked' state.
    return this.hasAttribute('selected');
  }

  set selected(val) {
    const isSelected = Boolean(val);
    if (isSelected) {
      super.setAttribute('selected', 'true'); // Use super to avoid recursion if attributeChangedCallback calls this setter
    } else {
      super.removeAttribute('selected');
    }
    // Ensure internal radio button also reflects this state
    if (this._inputElement.checked !== isSelected) {
        this._inputElement.checked = isSelected;
    }
  }

  // --- Event Handling ---
  connectedCallback() {
    // Add click listener to the host element or the label for better UX
    this.shadowRoot.querySelector('.option-box').addEventListener('click', this._handleClick.bind(this));
    
    // Reflect initial 'name' and 'value' (option-id) to the radio input
    if (this.hasAttribute('name')) {
        this._inputElement.name = this.getAttribute('name');
    }
    if (this.hasAttribute('option-id')) {
        this._inputElement.value = this.getAttribute('option-id');
    }
    // Reflect initial selected state
    if (this.hasAttribute('selected')) {
        this._inputElement.checked = true;
    }
  }

  _handleClick(event) {
    // If the click was directly on the input, its state is already handled by the browser.
    // If the click was on the label, we need to ensure the radio is checked.
    if (event.target !== this._inputElement) {
        // Prevent default if clicking label would toggle checkbox (not an issue for radio if properly grouped)
        // event.preventDefault(); 
        this._inputElement.checked = true; // Ensure the radio is checked
    }

    // If it became checked, update the 'selected' attribute and deselect others in the group
    if (this._inputElement.checked) {
      this.selected = true; // This will call the setter, which sets the attribute

      // Radio button behavior: Deselect other options in the same group
      // The group is determined by the 'name' attribute, typically `question_${question.question_id}`
      // This logic assumes all answer-option elements for a question are siblings under a common parent (e.g., '.options-list')
      if (this.parentElement && this.name) {
        const siblings = this.parentElement.querySelectorAll(`answer-option[name="${this.name}"]`);
        siblings.forEach(sibling => {
          if (sibling !== this) {
            sibling.selected = false; // This will call the setter on siblings
          }
        });
      }
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { selected: true, optionId: this.optionId } }));
    }
  }
}

customElements.define('answer-option', AnswerOption);

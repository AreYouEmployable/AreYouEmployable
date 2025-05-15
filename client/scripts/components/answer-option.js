const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/answer-option.css');
template.content.appendChild(stylesheetLink);

const labelElement = document.createElement('label');
labelElement.classList.add('option-box');

const inputRadioElement = document.createElement('input');
inputRadioElement.setAttribute('type', 'radio');
inputRadioElement.setAttribute('name', 'answer-group');
labelElement.appendChild(inputRadioElement);

const spanElement = document.createElement('span');
spanElement.id = 'labelText';
spanElement.classList.add('label-text');
spanElement.textContent = 'Answer option';
labelElement.appendChild(spanElement);

template.content.appendChild(labelElement);

class AnswerOption extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this._inputElement = this.shadowRoot.querySelector('input');
    this._labelTextElement = this.shadowRoot.querySelector('#labelText');
  }

  static get observedAttributes() {
    return ['name', 'option-id', 'label', 'selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'name') {
      this._inputElement.name = newValue;
    } else if (name === 'option-id') {
      this._inputElement.value = newValue; 
    } else if (name === 'label' && this.text === 'Answer option') {
    } else if (name === 'selected') {
        const isSelected = newValue !== null && newValue !== 'false';
        if (this._inputElement.checked !== isSelected) {
            this._inputElement.checked = isSelected;
        }
        if (isSelected && !this.hasAttribute('selected')) {
            super.setAttribute('selected', 'true');
        } else if (!isSelected && this.hasAttribute('selected')) {
            super.removeAttribute('selected');
        }
    }
  }

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
    return this.hasAttribute('selected');
  }

  set selected(val) {
    const isSelected = Boolean(val);
    if (isSelected) {
      super.setAttribute('selected', 'true'); 
    } else {
      super.removeAttribute('selected');
    }
    if (this._inputElement.checked !== isSelected) {
        this._inputElement.checked = isSelected;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.option-box').addEventListener('click', this._handleClick.bind(this));
    
    if (this.hasAttribute('name')) {
        this._inputElement.name = this.getAttribute('name');
    }
    if (this.hasAttribute('option-id')) {
        this._inputElement.value = this.getAttribute('option-id');
    }
    if (this.hasAttribute('selected')) {
        this._inputElement.checked = true;
    }
  }

  _handleClick(event) {
    if (event.target !== this._inputElement) {
        this._inputElement.checked = true;
    }

    if (this._inputElement.checked) {
      this.selected = true; 
      if (this.parentElement && this.name) {
        const siblings = this.parentElement.querySelectorAll(`answer-option[name="${this.name}"]`);
        siblings.forEach(sibling => {
          if (sibling !== this) {
            sibling.selected = false;
          }
        });
      }
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true, detail: { selected: true, optionId: this.optionId } }));
    }
  }
}

customElements.define('answer-option', AnswerOption);

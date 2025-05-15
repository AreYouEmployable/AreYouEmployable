import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/answer-option.css' }
});

const labelElement = createElementAndAppend(template.content, 'label', {
  classList: ['option-box']
});

const inputRadioElement = createElementAndAppend(labelElement, 'input', {
  attrs: { type: 'radio', name: 'answer-group' }
});

const spanElement = createElementAndAppend(labelElement, 'span', {
  props: { id: 'labelText', textContent: 'Answer option' },
  classList: ['label-text']
});

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
    } else if (name === 'label') {
      if (this.text === 'Answer option' || !this.hasAttribute('data-text-set-via-property')) {
         this.text = newValue;
      }
    } else if (name === 'selected') {
        const isSelected = newValue !== null && newValue !== 'false';
        if (this._inputElement.checked !== isSelected) {
            this._inputElement.checked = isSelected;
        }
    }
  }

  get text() {
    return this._labelTextElement.textContent;
  }

  set text(val) {
    this._labelTextElement.textContent = val;
    this.setAttribute('data-text-set-via-property', 'true');
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
      if (!this.hasAttribute('selected')) {
        super.setAttribute('selected', 'true');
      }
    } else {
      if (this.hasAttribute('selected')) {
        super.removeAttribute('selected');
      }
    }
    if (this._inputElement.checked !== isSelected) {
        this._inputElement.checked = isSelected;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.option-box').addEventListener('click', this._handleClick.bind(this));

    if (this.hasAttribute('label') && (this.text === 'Answer option' || !this.hasAttribute('data-text-set-via-property'))) {
        this.text = this.getAttribute('label');
    }
    if (this.hasAttribute('name')) {
        this._inputElement.name = this.getAttribute('name');
    }
    if (this.hasAttribute('option-id')) {
        this._inputElement.value = this.getAttribute('option-id');
    }
  
    if (this.hasAttribute('selected')) {
        this.selected = true; 
    } else {
        this.selected = false; 
    }
  }

  _handleClick(event) {
    if (!this._inputElement.checked) {
        this._inputElement.checked = true;
    }

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

customElements.define('answer-option', AnswerOption);

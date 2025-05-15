const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/option-item.css');
template.content.appendChild(stylesheetLink);

const labelElement = document.createElement('label');
labelElement.classList.add('flex', 'items-center', 'space-x-2');

const inputCheckboxElement = document.createElement('input');
inputCheckboxElement.setAttribute('type', 'checkbox');
inputCheckboxElement.setAttribute('name', 'answer');
inputCheckboxElement.classList.add('form-checkbox', 'text-blue-600');
labelElement.appendChild(inputCheckboxElement);

const slotElement = document.createElement('slot');
labelElement.appendChild(slotElement);

template.content.appendChild(labelElement);
class OptionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const label = this.getAttribute('label');
    const id = this.getAttribute('data-id');

    this.shadowRoot.querySelector('slot').textContent = label;
    const checkbox = this.shadowRoot.querySelector('input[type="checkbox"]');
    checkbox.value = id;
  }
}

customElements.define('option-item', OptionItem);
const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet" href="/styles/components/option-item.css">
  <label class="flex items-center space-x-2">
    <input type="checkbox" name="answer" class="form-checkbox text-blue-600" />
    <slot></slot>
  </label>
`;

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
const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="components/options-list/options-list.css">
      <div class="options-list">
        <slot></slot> <!-- Slot to insert the dynamically added option items -->
      </div>
    `;
class OptionsList extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}

customElements.define('options-list', OptionsList);

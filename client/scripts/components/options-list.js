class OptionsList extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="styles/components/options-list.css"
      <div class="options-list">
        <slot></slot>
      </div>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}
customElements.define('options-list', OptionsList);
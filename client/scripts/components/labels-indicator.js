// components/labels-indicator/labels-indicator.js
class LabelsIndicator extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
      template.innerHTML = `
        <link rel="stylesheet" href="components/labels-indicator/labels-indicator.css">
        <div class="labels">
          <span class="label technical">Technical</span>
          <span class="label difficulty">Medium</span>
        </div>
      `;
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }
  }
  customElements.define('labels-indicator', LabelsIndicator);
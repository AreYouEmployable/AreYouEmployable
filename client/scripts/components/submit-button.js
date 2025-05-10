const template = document.createElement('template');
      template.innerHTML = `
        <link rel="stylesheet" href="components/submit-button/submit-button.css">
        <button class="submit-button">Submit Answer</button>
      `;
class SubmitButton extends HTMLElement {
    constructor() {
      super();
      
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }
  }
  customElements.define('submit-button', SubmitButton);
const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', 'styles/components/submit-button.css');
template.content.appendChild(stylesheetLink);

const buttonElement = document.createElement('button');
buttonElement.classList.add('submit-button');
buttonElement.textContent = 'Submit Answer';
template.content.appendChild(buttonElement);

class SubmitButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}

customElements.define('submit-button', SubmitButton);

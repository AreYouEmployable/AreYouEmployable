const optionsListTemplate = document.createElement('template'); 

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', 'styles/components/options-list.css');
optionsListTemplate.content.appendChild(stylesheetLink);

const sectionElement = document.createElement('section');
sectionElement.classList.add('options-list');

const slotElement = document.createElement('slot');
sectionElement.appendChild(slotElement);

optionsListTemplate.content.appendChild(sectionElement);

class OptionsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(optionsListTemplate.content.cloneNode(true));
  }
}

customElements.define('options-list', OptionsList);

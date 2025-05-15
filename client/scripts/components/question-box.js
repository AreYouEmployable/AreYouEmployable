const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', 'styles/components/question-box.css');
template.content.appendChild(stylesheetLink);

const articleElement = document.createElement('article');
articleElement.classList.add('question-box');

const pElement = document.createElement('p');
pElement.id = 'questionText';
pElement.textContent = 'The production website is showing a blank page. What\'s your first step?';
articleElement.appendChild(pElement);

template.content.appendChild(articleElement);


class QuestionBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  set questionText(text) {
    this.shadowRoot.querySelector('#questionText').textContent = text;
  }
}

customElements.define('question-box', QuestionBox);

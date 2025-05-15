const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/not-found-page.css');
template.content.appendChild(stylesheetLink);

const articleElement = document.createElement('article');

const h2Element = document.createElement('h2');
h2Element.textContent = '404 Not Found';
articleElement.appendChild(h2Element);

const pElement = document.createElement('p');
pElement.textContent = 'The page you are looking for does not exist.';
articleElement.appendChild(pElement);

const aElement = document.createElement('a');
aElement.setAttribute('href', '/');
aElement.setAttribute('data-link', '');
aElement.textContent = 'Go Home';
articleElement.appendChild(aElement);

template.content.appendChild(articleElement);

class NotFoundPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('not-found-page', NotFoundPage); 
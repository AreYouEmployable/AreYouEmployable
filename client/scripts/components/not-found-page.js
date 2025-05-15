import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/not-found-page.css' }
});

const articleElement = createElementAndAppend(template.content, 'article');

createElementAndAppend(articleElement, 'h2', {
  props: { textContent: '404 Not Found' }
});

createElementAndAppend(articleElement, 'p', {
  props: { textContent: 'The page you are looking for does not exist.' }
});

createElementAndAppend(articleElement, 'a', {
  attrs: { href: '/', 'data-link': '' },
  props: { textContent: 'Go Home' }
});

class NotFoundPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('not-found-page', NotFoundPage);

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/not-found-page.css">
  <article>
    <h2>404 Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <a href="/" data-link>Go Home</a>
  </article>
`;

class NotFoundPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('not-found-page', NotFoundPage); 
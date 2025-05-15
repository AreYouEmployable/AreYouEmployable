import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/error-page.css');
template.content.appendChild(stylesheetLink);

const articleElement = document.createElement('article');
articleElement.classList.add('error-container');

const summaryElement = document.createElement('summary');
summaryElement.classList.add('error-content');

const h1Element = document.createElement('h1');
h1Element.classList.add('error-title');
h1Element.textContent = 'Access Denied';
summaryElement.appendChild(h1Element);

const pElement = document.createElement('p');
pElement.classList.add('error-message');
pElement.textContent = 'You do not have permission to access this resource.';
summaryElement.appendChild(pElement);

const sectionActionsElement = document.createElement('section');
sectionActionsElement.classList.add('error-actions');

const goHomeButton = document.createElement('button');
goHomeButton.id = 'goHomeBtn';
goHomeButton.classList.add('primary-button');
goHomeButton.textContent = 'Go to Home';
sectionActionsElement.appendChild(goHomeButton);

const signOutButton = document.createElement('button');
signOutButton.id = 'signOutBtn';
signOutButton.classList.add('secondary-button');
signOutButton.textContent = 'Sign Out';
sectionActionsElement.appendChild(signOutButton);

summaryElement.appendChild(sectionActionsElement);
articleElement.appendChild(summaryElement);
template.content.appendChild(articleElement);

class ErrorPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const goHomeBtn = this.shadowRoot.getElementById('goHomeBtn');
    const signOutBtn = this.shadowRoot.getElementById('signOutBtn');

    goHomeBtn.addEventListener('click', () => {
      window.location.href = '/';
    });

    signOutBtn.addEventListener('click', async () => {
      await AuthService.logout();
      window.location.href = '/';
    });
  }
}

customElements.define('error-page', ErrorPage); 
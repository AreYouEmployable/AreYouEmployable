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

const signInButton = document.createElement('button');
signInButton.id = 'signInBtn';
signInButton.classList.add('secondary-button');
signInButton.textContent = 'Sign In';
sectionActionsElement.appendChild(signInButton);

summaryElement.appendChild(sectionActionsElement);
articleElement.appendChild(summaryElement);
template.content.appendChild(articleElement);

export class ForbiddenPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.goHomeBtn = this.shadowRoot.querySelector('#goHomeBtn');
        this.signInBtn = this.shadowRoot.querySelector('#signInBtn'); 
        this.errorTitleElement = this.shadowRoot.querySelector('.error-title');
        this.errorMessageElement = this.shadowRoot.querySelector('.error-message');
    }

    connectedCallback() {
        if (this.hasAttribute('error-title')) {
            this.errorTitleElement.textContent = this.getAttribute('error-title');
        }
        if (this.hasAttribute('error-message')) {
            this.errorMessageElement.textContent = this.getAttribute('error-message');
        }

        if (this.goHomeBtn) {
            this.goHomeBtn.addEventListener('click', () => {
                console.log('Go to Home clicked');
                this.dispatchEvent(new CustomEvent('gohome', { bubbles: true, composed: true }));
            });
        }

        if (this.signInBtn) {
            this.signInBtn.addEventListener('click', () => {
                console.log('Sign In clicked'); 
                this.dispatchEvent(new CustomEvent('signin', { bubbles: true, composed: true }));
            });
        }
    }

    static get observedAttributes() {
        return ['error-title', 'error-message'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue === oldValue) return;
        switch (name) {
            case 'error-title':
                if (this.errorTitleElement) this.errorTitleElement.textContent = newValue;
                break;
            case 'error-message':
                if (this.errorMessageElement) this.errorMessageElement.textContent = newValue;
                break;
        }
    }
}

customElements.define('forbidden-page', ForbiddenPage);

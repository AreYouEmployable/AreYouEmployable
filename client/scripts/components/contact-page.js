const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/contact-page.css');
template.content.appendChild(stylesheetLink);

const articleElement = document.createElement('article');

const h2Element = document.createElement('h2');
articleElement.appendChild(h2Element);

const formElement = document.createElement('form');
formElement.id = 'contact-form';

const nameFormField = document.createElement('formfield');
nameFormField.classList.add('form-group');
const nameLabel = document.createElement('label');
nameLabel.setAttribute('for', 'name');
nameLabel.textContent = 'Name';
const nameInput = document.createElement('input');
nameInput.setAttribute('type', 'text');
nameInput.id = 'name';
nameInput.setAttribute('name', 'name');
nameInput.required = true;
nameFormField.appendChild(nameLabel);
nameFormField.appendChild(nameInput);
formElement.appendChild(nameFormField);

const emailFormField = document.createElement('formfield');
emailFormField.classList.add('form-group');
const emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'email');
emailLabel.textContent = 'Email';
const emailInput = document.createElement('input');
emailInput.setAttribute('type', 'email');
emailInput.id = 'email';
emailInput.setAttribute('name', 'email');
emailInput.required = true;
emailFormField.appendChild(emailLabel);
emailFormField.appendChild(emailInput);
formElement.appendChild(emailFormField);

const messageFormField = document.createElement('formfield');
messageFormField.classList.add('form-group');
const messageLabel = document.createElement('label');
messageLabel.setAttribute('for', 'message');
messageLabel.textContent = 'Message';
const messageTextarea = document.createElement('textarea');
messageTextarea.id = 'message';
messageTextarea.setAttribute('name', 'message');
messageTextarea.setAttribute('rows', '4');
messageTextarea.required = true;
messageFormField.appendChild(messageLabel);
messageFormField.appendChild(messageTextarea);
formElement.appendChild(messageFormField);

const submitButton = document.createElement('button');
submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Send Message';
formElement.appendChild(submitButton);

articleElement.appendChild(formElement);
template.content.appendChild(articleElement);

class ContactPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.titleElement = this.shadowRoot.querySelector('h2');
    this.form = this.shadowRoot.querySelector('#contact-form');
  }

  static get observedAttributes() {
    return ['title'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'title' && newValue !== oldValue) {
      this.titleElement.textContent = newValue;
    }
  }

  connectedCallback() {
    if (this.form) {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  disconnectedCallback() {
    if (this.form) {
      this.form.removeEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    if (this.form) {
        this.form.reset();
    }
   
  }
}

customElements.define('contact-page', ContactPage);

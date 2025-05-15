import { createElementAndAppend } from '../utils.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/contact-page.css' }
});

const articleElement = createElementAndAppend(template.content, 'article');

createElementAndAppend(articleElement, 'h2');

const formElement = createElementAndAppend(articleElement, 'form', {
  props: { id: 'contact-form' }
});

const nameFormField = createElementAndAppend(formElement, 'formfield', {
  classList: ['form-group']
});
createElementAndAppend(nameFormField, 'label', {
  attrs: { for: 'name' },
  props: { textContent: 'Name' }
});
createElementAndAppend(nameFormField, 'input', {
  attrs: { type: 'text', name: 'name', required: true },
  props: { id: 'name' }
});

const emailFormField = createElementAndAppend(formElement, 'formfield', {
  classList: ['form-group']
});
createElementAndAppend(emailFormField, 'label', {
  attrs: { for: 'email' },
  props: { textContent: 'Email' }
});
createElementAndAppend(emailFormField, 'input', {
  attrs: { type: 'email', name: 'email', required: true },
  props: { id: 'email' }
});

const messageFormField = createElementAndAppend(formElement, 'formfield', {
  classList: ['form-group']
});
createElementAndAppend(messageFormField, 'label', {
  attrs: { for: 'message' },
  props: { textContent: 'Message' }
});
createElementAndAppend(messageFormField, 'textarea', {
  attrs: { name: 'message', rows: '4', required: true },
  props: { id: 'message' }
});

createElementAndAppend(formElement, 'button', {
  attrs: { type: 'submit' },
  props: { textContent: 'Send Message' }
});

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
    if (this.hasAttribute('title') && this.titleElement) {
        this.titleElement.textContent = this.getAttribute('title');
    }
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
    console.log('Form data submitted:', data);
    if (this.form) {
        this.form.reset();
    }
    alert('Thank you for your message! We will get back to you soon.');
  }
}

customElements.define('contact-page', ContactPage);

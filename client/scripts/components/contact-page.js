const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/contact-page.css">
  <article>
    <h2></h2>
    <form id="contact-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="4" required></textarea>
      </div>
      <button type="submit">Send Message</button>
    </form>
  </article>
`;

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
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form submitted:', data);
    alert('Thank you for your message!');
    this.form.reset();
  }
}

customElements.define('contact-page', ContactPage);
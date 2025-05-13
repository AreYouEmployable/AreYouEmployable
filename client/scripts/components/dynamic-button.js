const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/dynamic-button.css">
  <button class="btn"><slot>Click Me</slot></button>
`;

class DynamicButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const btn = this.shadowRoot.querySelector('button');

    // Set background and text color
    const bgColor = this.getAttribute('bg-color') || '#3b82f6';
    const textColor = this.getAttribute('text-color') || '#ffffff';
    btn.style.backgroundColor = bgColor;
    btn.style.color = textColor;

    // Set dynamic text if 'text' attribute exists
    const text = this.getAttribute('text');
    if (text) {
      btn.textContent = text;
    }

    // Set disabled (clickable) state
    const isClickable = this.hasAttribute('clickable') && this.getAttribute('clickable') !== 'false';
    btn.disabled = !isClickable;

    // Set active styling
    const isActive = this.hasAttribute('active') && this.getAttribute('active') !== 'false';
    if (isActive) {
      btn.classList.add('active');
    }

    // Handle on-click event dispatch
    btn.onclick = () => {
      if (isClickable && this.hasAttribute('on-click')) {
        const eventName = this.getAttribute('on-click');
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
      }
    };
  }
}

customElements.define('dynamic-button', DynamicButton);

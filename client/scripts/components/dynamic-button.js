const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/dynamic-button.css');
template.content.appendChild(stylesheetLink);

const buttonElement = document.createElement('button');
buttonElement.classList.add('btn');

const slotElement = document.createElement('slot');
slotElement.textContent = 'Click Me';

buttonElement.appendChild(slotElement);
template.content.appendChild(buttonElement);

class DynamicButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const btn = this.shadowRoot.querySelector('button');

    const bgColor = this.getAttribute('bg-color') || '#3b82f6';
    const textColor = this.getAttribute('text-color') || '#ffffff';
    btn.style.backgroundColor = bgColor;
    btn.style.color = textColor;

    const text = this.getAttribute('text');
    if (text) {
      const slot = btn.querySelector('slot');
      if (slot) {
        slot.textContent = text; 
      } else {
        btn.textContent = text;
      }
    }

    const isClickable = this.hasAttribute('clickable') && this.getAttribute('clickable') !== 'false';
    btn.disabled = !isClickable;

    const isActive = this.hasAttribute('active') && this.getAttribute('active') !== 'false';
    if (isActive) {
      btn.classList.add('active');
    }

    btn.onclick = () => {
      if (isClickable && this.hasAttribute('on-click')) {
        const eventName = this.getAttribute('on-click');
        this.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true }));
      }
    };
  }
}

customElements.define('dynamic-button', DynamicButton);

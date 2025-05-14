
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/tag-label.css">
  <slot></slot>
`;

class TagLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['type'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'type') {
      const colorMap = {
        timed: '#ed8936',       
        assignment: '#48bb78',  
        urgent: '#e53e3e',      
      };
      this.style.setProperty('--tag-color', colorMap[newValue] || '#4299e1');
    }
  }
}

customElements.define('tag-label', TagLabel);

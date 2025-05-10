const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/complexity-level-bar.css">
  <section class="complexity-container">
    <label>Complexity:</label>
    <div class="level-bar" id="levelBar">Medium</div>
  </section>
`;

class ComplexityLevelBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['level'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'level') {
      const bar = this.shadowRoot.getElementById('levelBar');
      bar.textContent = newVal;
      bar.className = `level-bar ${newVal.toLowerCase()}`;
    }
  }
}

customElements.define('complexity-level-bar', ComplexityLevelBar);

// components/navigation-controls/navigation-controls.js
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/navigation-controls.css">
  <div class="navigation-controls">
    <button id="prev-btn" class="nav-button prev-button" disabled>Previous</button>
    <button id="next-btn" class="nav-button next-button" disabled>Next</button>
  </div>
`;

class NavigationControls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const prevBtn = this.shadowRoot.getElementById('prev-btn');
    const nextBtn = this.shadowRoot.getElementById('next-btn');

    prevBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { direction: 'prev' },
        bubbles: true,
        composed: true
      }));
    });

    nextBtn.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('navigate', {
        detail: { direction: 'next' },
        bubbles: true,
        composed: true
      }));
    });
  }

  set canGoBack(value) {
    this.shadowRoot.getElementById('prev-btn').disabled = !value;
  }

  set canGoForward(value) {
    this.shadowRoot.getElementById('next-btn').disabled = !value;
  }
}

customElements.define('navigation-controls', NavigationControls);

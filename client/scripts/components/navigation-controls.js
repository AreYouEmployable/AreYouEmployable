// components/navigation-controls/navigation-controls.js
class NavigationControls extends HTMLElement {
  constructor() {
    super();
    const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="components/navigation-controls/navigation-controls.css">
      <div class="navigation-controls">
        <button class="nav-button">Previous</button>
        <button class="nav-button">Next Scenario</button>
      </div>
    `;
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}
customElements.define('navigation-controls', NavigationControls);

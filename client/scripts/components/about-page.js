const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/about-page.css">
  <article>
    <h2></h2>
    <p>Learn more about our company and mission.</p>
    <section>
      <h3>Our Team</h3>
      <section id="team-members"></section>
    </section>
  </article>
`;

class AboutPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.titleElement = this.shadowRoot.querySelector('h2');
    this.teamContainer = this.shadowRoot.querySelector('#team-members');
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
    this.renderTeam();
  }

  renderTeam() {
    const team = [
      { name: 'John Doe', role: 'CEO' },
      { name: 'Jane Smith', role: 'CTO' },
      { name: 'Mike Johnson', role: 'Lead Developer' }
    ];

    this.teamContainer.innerHTML = '';
    
    team.forEach(member => {
      const memberElement = document.createElement('div');
      memberElement.className = 'team-member';
      memberElement.innerHTML = `
        <strong>${member.name}</strong>
        <span>${member.role}</span>
      `;
      this.teamContainer.appendChild(memberElement);
    });
  }
}

customElements.define('about-page', AboutPage);
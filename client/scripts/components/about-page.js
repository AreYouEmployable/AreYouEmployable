const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/about-page.css');
template.content.appendChild(stylesheetLink);

const mainArticle = document.createElement('article');

const h2Title = document.createElement('h2');
mainArticle.appendChild(h2Title);

const paragraph = document.createElement('p');
paragraph.textContent = 'Learn more about our company and mission.';
mainArticle.appendChild(paragraph);

const teamSection = document.createElement('section');

const h3TeamTitle = document.createElement('h3');
h3TeamTitle.textContent = 'Our Team';
teamSection.appendChild(h3TeamTitle);

const teamMembersSection = document.createElement('section');
teamMembersSection.id = 'team-members';
teamSection.appendChild(teamMembersSection);

mainArticle.appendChild(teamSection);

template.content.appendChild(mainArticle);

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
    
  }
}

customElements.define('about-page', AboutPage);
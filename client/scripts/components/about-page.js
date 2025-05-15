import { createElementAndAppend } from '../utils.js'; 

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/about-page.css' }
});

const mainArticle = createElementAndAppend(template.content, 'article');

createElementAndAppend(mainArticle, 'h2');

createElementAndAppend(mainArticle, 'p', {
  props: { textContent: 'Learn more about our company and mission.' }
});

const teamSection = createElementAndAppend(mainArticle, 'section');

createElementAndAppend(teamSection, 'h3', {
  props: { textContent: 'Our Team' }
});

createElementAndAppend(teamSection, 'section', {
  props: { id: 'team-members' }
});

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
      if (this.titleElement) { 
        this.titleElement.textContent = newValue;
      }
    }
  }

  connectedCallback() {
    if (this.hasAttribute('title') && this.titleElement) {
        this.titleElement.textContent = this.getAttribute('title');
    }
    this.renderTeam();
  }

  renderTeam() {
    if (this.teamContainer) {
        this.teamContainer.innerHTML = '';
    }

    const teamData = [
      { name: 'Alice Wonderland', role: 'Chief Visionary Officer' },
      { name: 'Bob The Builder', role: 'Lead Architect' },
      { name: 'Charlie Brown', role: 'Happiness Engineer' }
    ];

    if (this.teamContainer && teamData.length > 0) {
        teamData.forEach(member => {
            const memberArticle = createElementAndAppend(this.teamContainer, 'article', {
                classList: ['team-member', 'p-2', 'my-1', 'border', 'border-gray-200', 'rounded'] // Example styling classes
            });
            createElementAndAppend(memberArticle, 'h4', {
                props: { textContent: member.name },
                classList: ['font-semibold']
            });
            createElementAndAppend(memberArticle, 'p', {
                props: { textContent: member.role },
                classList: ['text-sm', 'text-gray-600']
            });
        });
    } else if (this.teamContainer) {
        createElementAndAppend(this.teamContainer, 'p', {
            props: { textContent: 'Team information is currently unavailable.'}
        });
    }
  }
}

customElements.define('about-page', AboutPage);

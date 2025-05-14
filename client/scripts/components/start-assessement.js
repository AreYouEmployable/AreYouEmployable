const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/start-assessment.css">
  <section class="start-container">
    <header class="start-header">
      <h1 class="start-title">ARE You Employable?</h1>
      <p class="start-description">
        Test your readiness for real-world software engineering roles. This interactive assessment simulates scenarios you'll encounter on the job.
      </p>
    </header>

    <ul class="assessment-info">
      <li><strong>Time:</strong> ~15 minutes</li>
      <li><strong>Scenarios:</strong> 3 realistic job tasks</li>
      <li><strong>Skills:</strong> Problem-solving, attention to detail, decision-making</li>
    </ul>

    <button class="start-button">Start Assessment</button>
  </section>
`;

class StartAssessment extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.start-button')
      .addEventListener('click', () => {
        window.location.href = '/assessment'; 
      });
  }
}

customElements.define('start-assessment', StartAssessment);

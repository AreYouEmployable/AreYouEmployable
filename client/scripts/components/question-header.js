const template = document.createElement('template');
    template.innerHTML = `
      <link rel="stylesheet" href="components/question-header/question-header.css">
      <div class="question-header">
        <h2>Debugging Challenge</h2>
        <p>You've been tasked with fixing a critical bug in production. How do you approach the situation?</p>
      </div>
    `;
class QuestionHeader extends HTMLElement {
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }
}
customElements.define('question-header', QuestionHeader);

const template = document.createElement('template');
      template.innerHTML = `
        <link rel="stylesheet" href="styles/components/question-box.css">
        <div class="question-box">
          <p>The production website is showing a blank page. What's your first step?</p>
        </div>
      `;
class QuestionBox extends HTMLElement {
    constructor() {
      super();
      
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
    }
  }
  customElements.define('question-box', QuestionBox);
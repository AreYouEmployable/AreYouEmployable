const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="styles/components/question-box.css">
  <article class="question-box">
    <p id="questionText">The production website is showing a blank page. What's your first step?</p>
  </article>
`;

class QuestionBox extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true));
  }

  set questionText(text) {
    this.shadowRoot.querySelector('#questionText').textContent = text;
  }
}

customElements.define('question-box', QuestionBox);

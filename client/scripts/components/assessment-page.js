import './progress-bar.js';
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css">
  <section class="container">
    <!-- Header Section -->
    <header class="text-center mb-8">
      <h2 class="scenario-title" id="scenario-title">Loading scenario title...</h2>
      <p class="scenario-description" id="scenario-description">Loading scenario description...</p>
    </header>

    <!-- Progress Bar Component -->
    <progress-bar total="5" class="mb-6"></progress-bar>

    <!-- Question Block (Container for each question) -->
    <article class="question-block">
      <!-- Question Header -->
      <header class="question-header">
        <h3 class="question-title" id="question-title">Loading question...</h3>
        <p class="complexity-text">Complexity: <span id="complexity-level">-</span></p>
      </header>

      <!-- Option List (Dynamic options added here) -->
      <form id="assessment-form">
        <div id="options-list" class="options-list"></div>

        <!-- Navigation Controls -->
        <navigation-controls></navigation-controls>
      </form>
    </article>
  </section>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.currentQuestion = 0;
    this.totalQuestions = 5;
    this.answers = new Map();
    
    // Sample questions data - replace with actual data source
    this.questions = [
      {
        title: "Debugging Challenge",
        description: "You've been tasked with fixing a critical bug in production. How do you approach the situation?",
        complexity: "Medium",
        options: [
          "Immediately deploy a hotfix without testing",
          "Analyze the error logs and reproduce the issue locally",
          "Ask the team for help without investigating",
          "Document the issue and wait for the next sprint"
        ]
      },
      // Add more questions here
    ];
  }

  connectedCallback() {
    const form = this.shadowRoot.querySelector('#assessment-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Initialize progress bar
    const progressBar = this.shadowRoot.querySelector('progress-bar');
    progressBar.setAttribute('total', this.totalQuestions.toString());
    
    // Initialize navigation controls
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.addEventListener('navigate', this.handleNavigation.bind(this));
    
    // Load first question
    this.loadQuestion(this.currentQuestion);
    this.updateNavigationState();
  }

  handleSubmit(e) {
    e.preventDefault();
    
    // Get selected options
    const selectedOptions = Array.from(this.shadowRoot.querySelectorAll('answer-option'))
      .map((option, index) => option.selected ? index : null)
      .filter(index => index !== null);
    
    // Save answer for current question
    this.answers.set(this.currentQuestion, {
      selectedOptions,
      questionId: this.currentQuestion
    });
    
    // Update progress
    const progressBar = this.shadowRoot.querySelector('progress-bar');
    progressBar.nextStep();
    
    // Update navigation state
    this.updateNavigationState();
    
    console.log('Answer submitted:', this.answers.get(this.currentQuestion));
  }

  handleNavigation(e) {
    const { direction } = e.detail;
    if (direction === 'prev' && this.currentQuestion > 0) {
      this.currentQuestion--;
    } else if (direction === 'next' && this.currentQuestion < this.totalQuestions - 1) {
      this.currentQuestion++;
    }
    
    // Load question data for the new current question
    this.loadQuestion(this.currentQuestion);
    this.updateNavigationState();
  }

  updateNavigationState() {
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.canGoBack = this.currentQuestion > 0;
    navControls.canGoForward = this.currentQuestion < this.totalQuestions - 1 && this.answers.has(this.currentQuestion);
  }

  loadQuestion(questionIndex) {
    const question = this.questions[questionIndex];
    if (!question) return;

    // Update question title and description
    const questionTitle = this.shadowRoot.querySelector('#question-title');
    const complexityLevel = this.shadowRoot.querySelector('#complexity-level');
    const scenarioTitle = this.shadowRoot.querySelector('#scenario-title');
    const scenarioDescription = this.shadowRoot.querySelector('#scenario-description');
    
    questionTitle.textContent = question.title;
    complexityLevel.textContent = question.complexity;
    scenarioTitle.textContent = `Scenario ${questionIndex + 1}`;
    scenarioDescription.textContent = question.description;
    
    // Create answer options
    const optionsList = this.shadowRoot.querySelector('#options-list');
    optionsList.innerHTML = '';
    
    question.options.forEach((optionText, index) => {
      const option = document.createElement('answer-option');
      option.text = optionText;
      
      // Restore saved answer if exists
      const savedAnswer = this.answers.get(questionIndex);
      if (savedAnswer && savedAnswer.selectedOptions.includes(index)) {
        option.selected = true;
      }
      
      optionsList.appendChild(option);
    });
  }
}

customElements.define('assessment-page', AssessmentPage); 
import './progress-bar.js';
import './question-header.js';
import './question-block.js';
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';
import './labels-indicator.js';
import './complexity-level-bar.js';
import './timer-tag.js'; 
import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css">
  <section class="container">
    <p class="progress-text">ASSESSMENT PROGRESS</p>
    <progress-bar total="2" class="progress-bar mb-6"></progress-bar>

    <article class="scenario-card">
      <header class="scenario-header">
        <h2 class="scenario-title" id="scenario-title">Loading scenario title...</h2>
        <p class="scenario-description" id="scenario-description"></p>
        <labels-indicator class="scenario-labels"></labels-indicator>
      </header>

      <timer-tag id="timer-tag" duration="300" label="5 minutes remaining"></timer-tag>

      <article class="question-block mt-8" id="scenario-questions">
      </article>
    </article>

    <navigation-controls></navigation-controls>
  </main>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.currentScenario = 0;
    this.totalScenarios = 0;
    this.answers = new Map();
    this.submittedCurrentScenario = false;
    this.assessmentComplete = false;
    this.scenarioQuestionsContainer = null;
    this.scenarios = [];
    this.assessment = null;
  }

  async connectedCallback() {
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.addEventListener('navigate', this.handleNavigation.bind(this));

    const progressBar = this.shadowRoot.querySelector('progress-bar');
    this.scenarioQuestionsContainer = this.shadowRoot.querySelector('#scenario-questions');
    
    try {
      const response = await ApiService.post('/api/assessment/create');
      if (response) {
        this.assessment= response;
        this.scenarios = response.scenario;
        this.totalScenarios = this.scenarios.length;
        progressBar.setAttribute('total', this.totalScenarios.toString());
        this.loadScenario(this.currentScenario);
      } else {
        console.error('Failed to fetch scenarios:', response);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
    }
    
    this.updateNavigationState();
  }

  async handleScenarioSubmit(e) {
    e.preventDefault();

    const currentScenarioQuestions = this.shadowRoot.querySelectorAll('.question-item');
    const scenarioAnswers = [];

    currentScenarioQuestions.forEach((questionElement, index) => {
      const selectedOptions = Array.from(questionElement.querySelectorAll('answer-option'))
        .map((option, optionIndex) => option.selected ? optionIndex : null)
        .filter(index => index !== null);
      scenarioAnswers.push({ questionIndex: index, selectedOptions });
    });
    console.log(this.scenarios);
    try {
      
      const response = await ApiService.post('/api/assessment/submit-scenario', {
        scenarioIndex: this.currentScenario,
        answers: scenarioAnswers,
        assessmentId: this.assessment.assessmentId
      });

      console.log('Scenario submitted successfully:', response);
      
      
      this.answers.set(this.currentScenario, scenarioAnswers);
      this.submittedCurrentScenario = true;
      this.updateNavigationState();

      
      if (response.isComplete) {
        this.assessmentComplete = true;
        this.updateNavigationState();
      }
    } catch (error) {
      console.error('Error submitting scenario:', error);
    }
  }

  handleNavigation(e) {
    const { direction } = e.detail;
  
    if (direction === 'next' && this.submittedCurrentScenario) {
      if (this.currentScenario < this.totalScenarios - 1) {
        this.currentScenario++;
        this.submittedCurrentScenario = false;
      } else if (this.assessmentComplete) {
        this.finishAssessment();
      }
    }
  
    this.loadScenario(this.currentScenario);
    this.updateNavigationState();
    this.updateProgressBarText();
    this.updateProgressBarValue(); 
  }
  

  updateNavigationState() {
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.canGoForward = this.submittedCurrentScenario;
    navControls.isLastScenario = this.currentScenario === this.totalScenarios - 1;
  }
  

  loadScenario(index) {
    if (!this.scenarios || !this.scenarios[index]) return;

    const currentScenario = this.scenarios[index];
    const scenarioTitle = this.shadowRoot.querySelector('#scenario-title');
    const scenarioDescription = this.shadowRoot.querySelector('#scenario-description');
    const labelsIndicator = this.shadowRoot.querySelector('.scenario-labels');
    
    scenarioTitle.textContent = currentScenario.scenario_title;
    scenarioDescription.textContent = currentScenario.scenario_description;
    
    
    labelsIndicator.setAttribute('labels', JSON.stringify([currentScenario.type, currentScenario.difficulty]));
    labelsIndicator.setAttribute('difficulty', currentScenario.difficulty.toLowerCase());

    this.scenarioQuestionsContainer.innerHTML = '';
    
    currentScenario.questions.forEach((question, questionIndex) => {
      const questionElement = document.createElement('section');
      questionElement.className = 'question-item';
      
      const questionHeader = document.createElement('question-header');
      questionHeader.setAttribute('title', question.question_text);
      
      const optionsList = document.createElement('li');
      optionsList.className = 'options-list';
      
      question.options.forEach((option) => {
        const answerOption = document.createElement('answer-option');
        answerOption.text = option.value;
        answerOption.setAttribute('option-id', option.option_id);
        
        
        const savedAnswers = this.answers.get(index);
        if (savedAnswers) {
          const questionAnswer = savedAnswers.find(a => a.questionIndex === questionIndex);
          if (questionAnswer && questionAnswer.selectedOptions.includes(option.option_id)) {
            answerOption.selected = true;
          }
        }
        
        optionsList.appendChild(answerOption);
      });
      
      questionElement.appendChild(questionHeader);
      questionElement.appendChild(optionsList);
      this.scenarioQuestionsContainer.appendChild(questionElement);
    });

    const submitButton = document.createElement('submit-button');
    submitButton.id = 'submit-scenario';
    submitButton.classList.add('mt-4');
    submitButton.addEventListener('click', this.handleScenarioSubmit.bind(this));
    this.scenarioQuestionsContainer.appendChild(submitButton);

    this.submittedCurrentScenario = this.answers.has(index);
    this.updateNavigationState();
  }

  updateProgressBarText() {
    const progressBar = this.shadowRoot.querySelector('progress-bar');
    progressBar.setAttribute('total', this.totalScenarios.toString());
    progressBar.setAttribute('current', (this.currentScenario + 1).toString());
    if (progressBar) {
      progressBar.setAttribute('text-position', 'end');
    }
  }

  updateProgressBarValue() {
    if (this.progressBar) {
      this.progressBar.setAttribute('value', (this.currentScenario + (this.submittedCurrentScenario ? 1 : 0)).toString());
    }
  }

  finishAssessment() {
    window.location.href = '/assessment-results';
  }
}

customElements.define('assessment-page', AssessmentPage);

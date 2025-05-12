import './progress-bar.js';
import './question-header.js';
import './question-block.js';
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';
import './labels-indicator.js';
import './complexity-level-bar.js';
import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css">
  <section class="container">
    <header class="text-center mb-8">
      <h2 class="scenario-title" id="scenario-title">Loading scenario title...</h2>
    </header>

    <span class="progress-text">ASSESSMENT PROGRESS</span>

    <progress-bar total="2" class="progress-bar mb-6"></progress-bar>

    <article class="question-block mt-8" id="scenario-questions">
    </article>

    <navigation-controls></navigation-controls>
  </section>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.currentScenario = 0;
    this.totalScenarios = 2;
    this.answers = new Map();
    this.submittedCurrentScenario = false;
    this.assessmentComplete = false;
    this.scenarioQuestionsContainer = null; 
    this.scenarios = [
      [
        {
          title: "Debugging Challenge 1",
          description: "Fixing bug 1...",
          complexity: "Medium",
          options: ["A1", "B1", "C1", "D1"]
        },
        {
          title: "Debugging Challenge 2",
          description: "Fixing bug 2...",
          complexity: "Easy",
          options: ["A2", "B2", "C2", "D2"]
        },
        {
          title: "Debugging Challenge 3",
          description: "Fixing bug 3...",
          complexity: "Hard",
          options: ["A3", "B3", "C3", "D3"]
        },
        {
          title: "Debugging Challenge 4",
          description: "Fixing bug 4...",
          complexity: "Medium",
          options: ["A4", "B4", "C4", "D4"]
        },
        {
          title: "Debugging Challenge 5",
          description: "Fixing bug 5...",
          complexity: "Easy",
          options: ["A5", "B5", "C5", "D5"]
        }
      ],
      [
        {
          title: "Team Collaboration",
          description: "How do you handle disagreements within a team?",
          complexity: "Easy",
          options: ["Avoid confrontation", "Force your opinion", "Listen and find a compromise", "Escalate immediately"]
        },
        {
          title: "Feedback Acceptance",
          description: "How do you react to constructive criticism?",
          complexity: "Medium",
          options: ["Get defensive", "Ignore it", "Reflect and learn", "Argue about it"]
        },
        {
          title: "Dealing with Pressure",
          description: "How do you manage stress in a fast-paced environment?",
          complexity: "Medium",
          options: ["Panic", "Work harder without breaks", "Prioritize and take breaks", "Blame others"]
        },
        {
          title: "Communication Style",
          description: "What is your preferred method of communication for important updates?",
          complexity: "Easy",
          options: ["Informal chat", "Email", "Meeting", "Shouting across the office"]
        },
        {
          title: "Adaptability",
          description: "How do you handle changes in project requirements?",
          complexity: "Medium",
          options: ["Resist the changes", "Complain loudly", "Assess the impact and adapt", "Ignore the new requirements"]
        }
      ]
    ];
    this.totalScenarios = this.scenarios.length;
  }

  connectedCallback() {
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.addEventListener('navigate', this.handleNavigation.bind(this));

    const progressBar = this.shadowRoot.querySelector('progress-bar');
    progressBar.setAttribute('total', this.totalScenarios.toString());
    this.updateProgressBarText();

    this.scenarioQuestionsContainer = this.shadowRoot.querySelector('#scenario-questions'); // Store here
    this.loadScenario(this.currentScenario);
    this.updateNavigationState();
  }

  handleScenarioSubmit(e) {
    e.preventDefault();

    const currentScenarioQuestions = this.shadowRoot.querySelectorAll('.question-item');
    const scenarioAnswers = [];

    currentScenarioQuestions.forEach((questionElement, index) => {
      const selectedOptions = Array.from(questionElement.querySelectorAll('answer-option'))
        .map((option, optionIndex) => option.selected ? optionIndex : null)
        .filter(index => index !== null);
      scenarioAnswers.push({ questionIndex: index, selectedOptions });
    });

    this.answers.set(this.currentScenario, scenarioAnswers);
    this.submittedCurrentScenario = true;
    this.updateNavigationState();

    console.log('Answers submitted for scenario:', this.answers.get(this.currentScenario));

    if (this.currentScenario === this.totalScenarios - 1) {
      this.assessmentComplete = true;
      this.updateNavigationState();
    }
  }

  handleNavigation(e) {
    const { direction } = e.detail;
    if (direction === 'prev' && this.currentScenario > 0) {
      this.currentScenario--;
      this.submittedCurrentScenario = this.answers.has(this.currentScenario);
      this.assessmentComplete = false;
    } else if (direction === 'next' && this.submittedCurrentScenario) {
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
  }

  updateNavigationState() {
    const navControls = this.shadowRoot.querySelector('navigation-controls');
    navControls.canGoBack = this.currentScenario > 0;
    navControls.canGoForward = this.submittedCurrentScenario; // Corrected line
    navControls.isLastScenario = this.currentScenario === this.totalScenarios - 1;
  }

  loadScenario(scenarioIndex) {
    const scenario = this.scenarios[scenarioIndex];
    if (!scenario) return;

    const scenarioTitle = this.shadowRoot.querySelector('#scenario-title');
    scenarioTitle.textContent = `Scenario ${scenarioIndex + 1}`;

    const scenarioQuestionsContainer = this.scenarioQuestionsContainer; // Use the stored reference
    scenarioQuestionsContainer.innerHTML = '';

    scenario.forEach((question, index) => {
      const questionItem = document.createElement('div');
      questionItem.classList.add('question-item');

      const labelsIndicator = document.createElement('labels-indicator');
      const scenarioType = scenarioIndex === 0 ? "Technical" : "Culture Fit";
      labelsIndicator.setAttribute('labels', JSON.stringify([scenarioType, question.complexity]));
      labelsIndicator.setAttribute('difficulty', question.complexity.toLowerCase());
      questionItem.appendChild(labelsIndicator);

      const questionHeader = document.createElement('question-header');
      questionHeader.setAttribute('title', question.title);
      questionHeader.setAttribute('description', question.description);
      questionItem.appendChild(questionHeader);

      const optionsList = document.createElement('div');
      optionsList.classList.add('options-list');

      question.options.forEach((optionText, optionIndex) => {
        const option = document.createElement('answer-option');
        option.text = optionText;

        const savedAnswersForScenario = this.answers.get(scenarioIndex);
        if (savedAnswersForScenario && savedAnswersForScenario[index] && savedAnswersForScenario[index].selectedOptions.includes(optionIndex)) {
          option.selected = true;
        }
        optionsList.appendChild(option);
      });
      questionItem.appendChild(optionsList);

      scenarioQuestionsContainer.appendChild(questionItem);
    });

    const submitButton = document.createElement('submit-button');
    submitButton.id = 'submit-scenario';
    submitButton.classList.add('mt-4');
    submitButton.addEventListener('click', this.handleScenarioSubmit.bind(this));
    scenarioQuestionsContainer.appendChild(submitButton);

    this.submittedCurrentScenario = this.answers.has(scenarioIndex);
    this.updateNavigationState();
  }

  updateProgressBarText() {
    const progressBar = this.shadowRoot.querySelector('progress-bar');
    progressBar.setAttribute('total', this.totalScenarios.toString());
    if (progressBar) {
      progressBar.setAttribute('text-position', 'end');
    }
  }

  finishAssessment() {
    console.log('Assessment finished. Navigating to the next page...');
    window.location.href = '/assessment-results';
  }
}

customElements.define('assessment-page', AssessmentPage);

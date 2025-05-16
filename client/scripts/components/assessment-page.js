import './progress-bar.js';
import './question-header.js';
import './question-block.js';
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';
import './labels-indicator.js';
import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/assessment-page.css');
template.content.appendChild(stylesheetLink);

const containerSection = document.createElement('section');
containerSection.classList.add('container');

const progressTextSpan = document.createElement('span');
progressTextSpan.classList.add('progress-text');
progressTextSpan.textContent = 'ASSESSMENT PROGRESS';
containerSection.appendChild(progressTextSpan);

const progressBar = document.createElement('progress-bar');
progressBar.setAttribute('total', '0');
progressBar.setAttribute('current', '0');
progressBar.setAttribute('value', '0');
progressBar.classList.add('progress-bar', 'mb-6');
containerSection.appendChild(progressBar);

const scenarioCardArticle = document.createElement('article');
scenarioCardArticle.classList.add('scenario-card');

const scenarioHeader = document.createElement('header');
scenarioHeader.classList.add('scenario-header');

const scenarioTitleH2 = document.createElement('h2');
scenarioTitleH2.classList.add('scenario-title');
scenarioTitleH2.id = 'scenario-title';
scenarioTitleH2.textContent = 'Loading scenario...';
scenarioHeader.appendChild(scenarioTitleH2);

const scenarioDescriptionP = document.createElement('p');
scenarioDescriptionP.classList.add('scenario-description');
scenarioDescriptionP.id = 'scenario-description';
scenarioHeader.appendChild(scenarioDescriptionP);

const labelsIndicator = document.createElement('labels-indicator');
labelsIndicator.classList.add('scenario-labels');
scenarioHeader.appendChild(labelsIndicator);

scenarioCardArticle.appendChild(scenarioHeader);

const questionBlockArticle = document.createElement('article');
questionBlockArticle.classList.add('question-block', 'mt-8');
questionBlockArticle.id = 'scenario-questions';

scenarioCardArticle.appendChild(questionBlockArticle);
containerSection.appendChild(scenarioCardArticle);

const navigationControlsElement = document.createElement('navigation-controls');
containerSection.appendChild(navigationControlsElement);

template.content.appendChild(containerSection);

class AssessmentPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.assessmentId = null;
    this.currentScenarioData = null;

    this.currentScenario = 0;
    this.totalScenarios = 0;
    this.answers = new Map();
    this.submittedCurrentScenario = false;
    this.assessmentComplete = false;
    this.progressBarElement = this.shadowRoot.querySelector('progress-bar');
    this.scenarioTitleElement = this.shadowRoot.querySelector('#scenario-title');
    this.scenarioDescriptionElement = this.shadowRoot.querySelector('#scenario-description');
    this.labelsIndicatorElement = this.shadowRoot.querySelector('.scenario-labels');
    this.scenarioQuestionsContainer = this.shadowRoot.querySelector('#scenario-questions');
    this.navControlsElement = this.shadowRoot.querySelector('navigation-controls');
  }

  async connectedCallback() {
    if (this.navControlsElement) {
        this.navControlsElement.addEventListener('navigate', this.handleNavigation.bind(this));
    } else {
        console.error("AssessmentPage: navigation-controls element not found in shadow DOM.");
    }

    try {
      const user = await AuthService.getUserInfo();
      if (!user || !user.id) {
        this.displayError("User not authenticated. Please sign in to start an assessment.");
        if (this.navControlsElement) {
          this.navControlsElement.canGoForward = true;
          this.navControlsElement.canGoBack = false;
        }
        return;
      }
      const userIdForApi = user.id;

      const createResponse = await ApiService.post('/api/assessment/create', { userId: userIdForApi });

      if (!createResponse || !createResponse.assessmentId) {
        throw new Error('Failed to create assessment or assessmentId not returned.');
      }
      this.assessmentId = createResponse.assessmentId;

      const firstScenarioAndSummaryData = await ApiService.get(`/api/assessment/${this.assessmentId}`);

      if (!firstScenarioAndSummaryData || typeof firstScenarioAndSummaryData.index === 'undefined' || typeof firstScenarioAndSummaryData.totalScenarios === 'undefined') {
        throw new Error('AssessmentPage: Failed to fetch initial assessment data, or data is malformed (missing index or totalScenarios).');
      }

      this.totalScenarios = firstScenarioAndSummaryData.totalScenarios;
      this.currentScenario = firstScenarioAndSummaryData.index - 1;
      this.currentScenarioData = firstScenarioAndSummaryData;

      if (this.progressBarElement) {
        this.progressBarElement.setAttribute('total', this.totalScenarios.toString());
        this.progressBarElement.setAttribute('current', '0');
        this.progressBarElement.setAttribute('value', '0');
      }

      if (this.totalScenarios > 0) {
        this.scenarioTitleElement.textContent = this.currentScenarioData.title || `Scenario ${this.currentScenario + 1}`;
        this.scenarioDescriptionElement.textContent = this.currentScenarioData.description || '';
        if (this.labelsIndicatorElement && this.currentScenarioData.type && this.currentScenarioData.difficulty) {
          this.labelsIndicatorElement.setAttribute('labels', JSON.stringify([this.currentScenarioData.type, this.currentScenarioData.difficulty]));
          this.labelsIndicatorElement.setAttribute('difficulty', (this.currentScenarioData.difficulty).toLowerCase());
        }
        this.renderQuestionsAndSubmit();
        this.submittedCurrentScenario = this.answers.has(this.currentScenario);
        this.updateNavigationState();
      } else {
        this.scenarioTitleElement.textContent = 'Assessment Ready';
        this.scenarioDescriptionElement.textContent = 'No scenarios are available for this assessment.';
        if (this.scenarioQuestionsContainer) {
            while (this.scenarioQuestionsContainer.firstChild) {
                this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
            }
        }
        this.assessmentComplete = true;
        this.updateNavigationState();
      }
    } catch (error) {
      console.error('AssessmentPage: Error initializing assessment:', error);
      this.displayError(`Could not initialize assessment: ${error.message}`);
    }
  }
  displayError(message) {
    if (this.scenarioTitleElement) this.scenarioTitleElement.textContent = 'Error';
    if (this.scenarioDescriptionElement) this.scenarioDescriptionElement.textContent = '';
    if (this.scenarioQuestionsContainer) {
        while (this.scenarioQuestionsContainer.firstChild) {
            this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
        }
        const p = document.createElement('p');
        p.style.color = 'red';
        p.style.fontWeight = 'bold';
        p.textContent = message;
        this.scenarioQuestionsContainer.appendChild(p);
    }
    if (this.navControlsElement) {
      this.navControlsElement.canGoForward = false;
      this.navControlsElement.canGoBack = false;
    }
  }

  async loadScenario(index) {
    if (!this.assessmentId) {
      console.error("AssessmentPage: Cannot load scenario: assessmentId is not set.");
      this.displayError("Assessment ID is missing. Cannot load scenario.");
      return;
    }

    if (index < 0 || (this.totalScenarios > 0 && index >= this.totalScenarios)) {
      console.warn(`AssessmentPage: Invalid scenario index: ${index}. Total: ${this.totalScenarios}.`);
      if (index >= this.totalScenarios && this.totalScenarios > 0) {
        this.assessmentComplete = true;
        this.finishAssessment();
      }
      return;
    }

    if (this.totalScenarios === 0) {
      this.assessmentComplete = true;
      this.updateNavigationState();
      if(this.scenarioTitleElement) this.scenarioTitleElement.textContent = 'Assessment Ended';
      if(this.scenarioDescriptionElement) this.scenarioDescriptionElement.textContent = 'There are no more scenarios.';
      if(this.scenarioQuestionsContainer) {
        while (this.scenarioQuestionsContainer.firstChild) {
            this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
        }
      }
      return;
    }

    if(this.scenarioQuestionsContainer) {
        while (this.scenarioQuestionsContainer.firstChild) {
            this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
        }
        const p = document.createElement('p');
        p.textContent = 'Loading scenario content...';
        this.scenarioQuestionsContainer.appendChild(p);
    }
    this.currentScenarioData = null;
    this.submittedCurrentScenario = this.answers.has(index);

    try {
      const scenarioIndexForAPI = index + 1;
      const scenarioData = await ApiService.get(`/api/assessment/${this.assessmentId}/scenarios/${scenarioIndexForAPI}`);

      if (!scenarioData) {
        throw new Error(`Failed to load scenario data for index ${index} (API index ${scenarioIndexForAPI}).`);
      }
      this.currentScenarioData = scenarioData;
      this.currentScenario = index;

      if(this.scenarioTitleElement) this.scenarioTitleElement.textContent = this.currentScenarioData.title || `Scenario ${scenarioIndexForAPI}`;
      if(this.scenarioDescriptionElement) this.scenarioDescriptionElement.textContent = this.currentScenarioData.description || '';

      if (this.labelsIndicatorElement && this.currentScenarioData.type && this.currentScenarioData.difficulty) {
        this.labelsIndicatorElement.setAttribute('labels', JSON.stringify([this.currentScenarioData.type, this.currentScenarioData.difficulty]));
        this.labelsIndicatorElement.setAttribute('difficulty', (this.currentScenarioData.difficulty).toLowerCase());
      }

      this.renderQuestionsAndSubmit();
      this.updateNavigationState();

    } catch (error) {
      this.displayError(`Failed to load scenario: ${error.message}`);
      this.currentScenarioData = null;
      this.updateNavigationState();
    }
  }

  renderQuestionsAndSubmit() {
    if (!this.scenarioQuestionsContainer) return;
    while (this.scenarioQuestionsContainer.firstChild) {
        this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
    }

    if (!this.currentScenarioData || !this.currentScenarioData.questions || this.currentScenarioData.questions.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'This scenario has no questions. You can proceed to the next scenario.';
      this.scenarioQuestionsContainer.appendChild(p);
      this.submittedCurrentScenario = true;
    } else {
      this.currentScenarioData.questions.forEach((question) => { // Removed unused questionIndex
        const questionElement = document.createElement('section'); // Changed div to section for semantic grouping
        questionElement.className = 'question-item mb-4 p-4 border border-gray-200 rounded-lg shadow-sm';

        const questionHeader = document.createElement('question-header');
        questionHeader.setAttribute('title', question.question_text);

        const optionsList = document.createElement('section'); // Changed div to section
        optionsList.className = 'options-list mt-2';

        question.options.forEach((option) => {
          const answerOption = document.createElement('answer-option');
          answerOption.text = option.value;
          answerOption.label = option.label;
          answerOption.setAttribute('option-id', option.option_id.toString());
          answerOption.setAttribute('name', `question_${question.question_id}`);

          const savedScenarioAnswers = this.answers.get(this.currentScenario);
          if (savedScenarioAnswers) {
            const savedQuestionAnswer = savedScenarioAnswers.find(a => a.question_id === question.question_id);
            if (savedQuestionAnswer && savedQuestionAnswer.selected_option_id === option.option_id) {
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

      if (this.submittedCurrentScenario) {
        submitButton.setAttribute('disabled', 'true');
        submitButton.textContent = 'Answers Submitted';
      } else {
        submitButton.textContent = 'Submit Answers';
      }
      submitButton.addEventListener('click', this.handleScenarioSubmit.bind(this));
      this.scenarioQuestionsContainer.appendChild(submitButton);
    }
  }

  async handleScenarioSubmit(e) {
    if (e) e.preventDefault();

    if (this.submittedCurrentScenario) {
      console.log("Scenario already submitted.");
      return;
    }

    const scenarioAnswersPayload = [];
    let allQuestionsAnswered = true;

    if (this.currentScenarioData && this.currentScenarioData.questions && this.currentScenarioData.questions.length > 0) {
      this.currentScenarioData.questions.forEach((question, qIndex) => {
        const questionItemElement = this.scenarioQuestionsContainer.querySelectorAll('.question-item')[qIndex];
        let questionAnsweredThisCheck = false;
        if (questionItemElement) {
            const selectedOptionElement = questionItemElement.querySelector('answer-option[selected="true"], answer-option[selected]');
            if (selectedOptionElement) {
                const selectedOptionId = parseInt(selectedOptionElement.getAttribute('option-id'), 10);
                if (!isNaN(selectedOptionId)) {
                    scenarioAnswersPayload.push({
                        question_id: question.question_id,
                        selected_option_id: selectedOptionId
                    });
                    questionAnsweredThisCheck = true;
                } else {
                    console.warn(`Invalid option-id found for question ${question.question_id}`);
                }
            }
        }
        if (!questionAnsweredThisCheck) {
          allQuestionsAnswered = false;
        }
      });

      if (!allQuestionsAnswered) {
        alert('Please answer all questions for this scenario before submitting.');
        return;
      }
    } else {
      this.submittedCurrentScenario = true;
      this.updateNavigationState();
      return;
    }

    try {
      const scenarioIndexForAPI = this.currentScenario + 1;
      await ApiService.post('/api/assessment/submit-scenario', {
        assessmentId: this.assessmentId,
        scenarioIndex: scenarioIndexForAPI,
        answers: scenarioAnswersPayload,
      });

      this.answers.set(this.currentScenario, scenarioAnswersPayload);
      this.submittedCurrentScenario = true;

      const submitBtn = this.shadowRoot.querySelector('#submit-scenario');
      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.textContent = 'Answers Submitted';
      }

      this.updateNavigationState();
      if (this.progressBarElement) {
        const completedScenarios = this.answers.size;
        this.progressBarElement.setAttribute('current', completedScenarios.toString());
        this.progressBarElement.setAttribute('value', completedScenarios.toString());
      }

    } catch (error) {
      console.error('AssessmentPage: Error submitting answers:', error);
      const errorP = document.createElement('p');
      errorP.style.color = 'red';
      errorP.textContent = `Error submitting answers: ${error.message}`;
      const submitBtn = this.shadowRoot.querySelector('#submit-scenario');
      if (submitBtn && submitBtn.nextSibling && submitBtn.nextSibling.nodeName === 'P' && submitBtn.nextSibling.style.color === 'red') {
        submitBtn.parentNode.replaceChild(errorP, submitBtn.nextSibling);
      } else if (submitBtn) {
        submitBtn.parentNode.insertBefore(errorP, submitBtn.nextSibling);
      } else if (this.scenarioQuestionsContainer){
        this.scenarioQuestionsContainer.appendChild(errorP);
      }
    }
  }

  handleNavigation(e) {
    const { direction } = e.detail;
    if (direction === 'prev' && this.currentScenario > 0) {
      this.currentScenario--;
      this.assessmentComplete = false;
      this.loadScenario(this.currentScenario);
    } else if (direction === 'next') {
      const canProceed = this.submittedCurrentScenario ||
        (this.currentScenarioData && (!this.currentScenarioData.questions || this.currentScenarioData.questions.length === 0));

      if (!canProceed) {
        alert("Please submit your answers for the current scenario before proceeding.");
        return;
      }

      if (this.currentScenario < this.totalScenarios - 1) {
        this.currentScenario++;
        this.loadScenario(this.currentScenario);
      } else if (this.currentScenario === this.totalScenarios - 1 && canProceed) {
        this.finishAssessment();
      }
    }
  }

  updateNavigationState() {
    if (!this.navControlsElement) return;

    this.navControlsElement.canGoBack = this.currentScenario > 0 && !this.assessmentComplete;

    const currentScenarioHasQuestions = this.currentScenarioData &&
                                      this.currentScenarioData.questions &&
                                      this.currentScenarioData.questions.length > 0;
    const canProceedFromCurrent = this.submittedCurrentScenario || !currentScenarioHasQuestions;

    this.navControlsElement.canGoForward = canProceedFromCurrent &&
                                         !this.assessmentComplete &&
                                         this.totalScenarios > 0 &&
                                         this.currentScenario < this.totalScenarios;

    if (this.currentScenario === this.totalScenarios - 1 &&
        canProceedFromCurrent &&
        this.totalScenarios > 0 &&
        !this.assessmentComplete) {
      this.navControlsElement.isLastScenario = true;
    } else {
      this.navControlsElement.isLastScenario = false;
    }

    this.navControlsElement.style.display = this.assessmentComplete ? 'none' : '';

    this.updateProgressBarText();
  }

  updateProgressBarText() {
    if (!this.progressBarElement) return;

    this.progressBarElement.setAttribute('current', this.answers.size.toString());
    this.progressBarElement.setAttribute('value', this.answers.size.toString());
  }

  updateProgressBarValue() {
    if (!this.progressBarElement) return;
    this.progressBarElement.setAttribute('value', this.answers.size.toString());
  }
  async finishAssessment() {
    this.assessmentComplete = true;
    this.updateNavigationState();

    if(this.scenarioTitleElement) this.scenarioTitleElement.textContent = "Assessment Complete!";
    if(this.scenarioDescriptionElement) this.scenarioDescriptionElement.textContent = "Thank you for completing the assessment.";
    if(this.scenarioQuestionsContainer) {
        while (this.scenarioQuestionsContainer.firstChild) {
            this.scenarioQuestionsContainer.removeChild(this.scenarioQuestionsContainer.firstChild);
        }
        const p1 = document.createElement('p');
        p1.className = 'text-lg text-gray-700';
        p1.textContent = 'You will be redirected to the results page shortly.';
        this.scenarioQuestionsContainer.appendChild(p1);

        const p2 = document.createElement('p');
        p2.className = 'mt-2';
        const link = document.createElement('a');
        link.href = `/results?assessmentId=${this.assessmentId}`;
        link.className = 'text-blue-600 hover:underline';
        link.textContent = 'View Results Now';
        p2.appendChild(link);
        this.scenarioQuestionsContainer.appendChild(p2);
    }
    if (this.progressBarElement) {
        this.progressBarElement.setAttribute('current', this.totalScenarios.toString());
        this.progressBarElement.setAttribute('value', this.totalScenarios.toString());
    }

    try {
        // Assuming the API endpoint is to finalize or mark completion
        await ApiService.post(`/api/assessment/submit/${this.assessmentId}`); // Or a more appropriate endpoint like /finalize
    } catch (finalizationError) {
      console.error("AssessmentPage: Error during final assessment finalization call:", finalizationError);
    }

    setTimeout(() => {
      if (this.assessmentId) {
        window.location.href = `/results?assessmentId=${this.assessmentId}`;
      } else {
        console.error("AssessmentPage: Cannot redirect, assessmentId is missing.");
      }
    }, 3000);
  }
}

customElements.define('assessment-page', AssessmentPage);

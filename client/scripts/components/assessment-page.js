import './progress-bar.js';
import './question-header.js';
import './question-block.js'; // This might not be directly used if questions are rendered dynamically
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';
import './labels-indicator.js';
import './complexity-level-bar.js'; // Not explicitly used in the provided logic, but kept from your imports
import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/assessment-page.css"> <section class="container">
    <span class="progress-text">ASSESSMENT PROGRESS</span>
    <progress-bar total="0" current="0" value="0" class="progress-bar mb-6"></progress-bar>

    <article class="scenario-card">
      <header class="scenario-header">
        <h2 class="scenario-title" id="scenario-title">Loading scenario...</h2>
        <p class="scenario-description" id="scenario-description"></p>
        <labels-indicator class="scenario-labels"></labels-indicator>
      </header>

      <article class="question-block mt-8" id="scenario-questions">
        </article>
    </article>

    <navigation-controls></navigation-controls>
  </section>
`;

class AssessmentPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.assessmentId = null;
    // this.assessmentSummary = null; // Data from initial fetch will be the first scenario's data
    this.currentScenarioData = null;

    this.currentScenario = 0; // 0-indexed internally for the current scenario being processed/displayed
    this.totalScenarios = 0;
    this.answers = new Map(); // Stores answers for submitted scenarios: { scenarioIndex (0-based) -> answersPayload }
    this.submittedCurrentScenario = false; // Tracks if the *currently displayed* scenario's answers have been submitted
    this.assessmentComplete = false; // True when the backend confirms all scenarios are done

    // DOM Elements
    this.progressBarElement = this.shadowRoot.querySelector('progress-bar');
    this.scenarioTitleElement = this.shadowRoot.querySelector('#scenario-title');
    this.scenarioDescriptionElement = this.shadowRoot.querySelector('#scenario-description');
    this.labelsIndicatorElement = this.shadowRoot.querySelector('.scenario-labels');
    this.scenarioQuestionsContainer = this.shadowRoot.querySelector('#scenario-questions');
    this.navControlsElement = this.shadowRoot.querySelector('navigation-controls');
  }

  async connectedCallback() {
    this.navControlsElement.addEventListener('navigate', this.handleNavigation.bind(this));
    
    try {
      // 0. Get User Info (asynchronously)
      const user = await AuthService.getUserInfo();
      if (!user || !user.id) {
        this.displayError("User not authenticated. Please sign in to start an assessment.");
        if(this.navControlsElement) {
            this.navControlsElement.canGoForward = true;
            this.navControlsElement.canGoBack = false;
        }
        return; 
      }
      const userIdForApi = user.id; 

      // 1. Create Assessment
      // const createResponse = await ApiService.post('/api/assessment/create', { userId: userIdForApi });

      // if (!createResponse || !createResponse.assessmentId) {
      //   throw new Error('Failed to create assessment or assessmentId not returned.');
      // }
      this.assessmentId = 12;
      console.log('AssessmentPage: Assessment created with ID:', this.assessmentId);

      // 2. Fetch the first scenario's data (which also includes totalScenarios)
      const firstScenarioAndSummaryData = await ApiService.get(`/api/assessment/${this.assessmentId}`);
      console.log('AssessmentPage: Data from initial assessment fetch (first scenario & summary):', firstScenarioAndSummaryData); 

      if (!firstScenarioAndSummaryData || typeof firstScenarioAndSummaryData.index === 'undefined' || typeof firstScenarioAndSummaryData.totalScenarios === 'undefined') {
        throw new Error('AssessmentPage: Failed to fetch initial assessment data, or data is malformed (missing index or totalScenarios).');
      }
      
      this.totalScenarios = firstScenarioAndSummaryData.totalScenarios;
      this.currentScenario = firstScenarioAndSummaryData.index - 1; 
      this.currentScenarioData = firstScenarioAndSummaryData;

      this.progressBarElement.setAttribute('total', this.totalScenarios.toString());
      this.updateProgressBarText(); 

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
        this.updateProgressBarValue(); 
      } else {
        this.scenarioTitleElement.textContent = 'Assessment Ready';
        this.scenarioDescriptionElement.textContent = 'No scenarios are available for this assessment.';
        this.scenarioQuestionsContainer.innerHTML = '';
        this.assessmentComplete = true; 
        this.updateNavigationState();
      }
    } catch (error) {
      console.error('AssessmentPage: Error initializing assessment:', error);
      this.displayError(`Could not initialize assessment: ${error.message}`);
    }
  }

  displayError(message) {
    this.scenarioTitleElement.textContent = 'Error';
    this.scenarioDescriptionElement.textContent = '';
    this.scenarioQuestionsContainer.innerHTML = `<p style="color:red; font-weight:bold;">${message}</p>`;
    if (this.navControlsElement) {
        this.navControlsElement.canGoForward = false;
        this.navControlsElement.canGoBack = false;
    }
  }

  async loadScenario(index) { // index is 0-based
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
        return;
    }

    this.scenarioQuestionsContainer.innerHTML = '<p>Loading scenario content...</p>'; 
    this.currentScenarioData = null; 
    this.submittedCurrentScenario = this.answers.has(index); 

    try {
      const scenarioIndexForAPI = index + 1; 
      console.log(`AssessmentPage: Loading scenario ${scenarioIndexForAPI} (index ${index}) for assessment ${this.assessmentId}`);
      const scenarioData = await ApiService.get(`/api/assessment/${this.assessmentId}/scenarios/${scenarioIndexForAPI}`);

      if (!scenarioData) {
        throw new Error(`Failed to load scenario data for index ${index} (API index ${scenarioIndexForAPI}).`);
      }
      this.currentScenarioData = scenarioData;
      this.currentScenario = index; 

      this.scenarioTitleElement.textContent = this.currentScenarioData.title || `Scenario ${scenarioIndexForAPI}`;
      this.scenarioDescriptionElement.textContent = this.currentScenarioData.description || '';
      
      if (this.labelsIndicatorElement && this.currentScenarioData.type && this.currentScenarioData.difficulty) {
        this.labelsIndicatorElement.setAttribute('labels', JSON.stringify([this.currentScenarioData.type, this.currentScenarioData.difficulty]));
        this.labelsIndicatorElement.setAttribute('difficulty', (this.currentScenarioData.difficulty).toLowerCase());
      }

      this.renderQuestionsAndSubmit();
      
      this.updateNavigationState();
      this.updateProgressBarText();
      this.updateProgressBarValue();

    } catch (error) {
      console.error(`AssessmentPage: Error loading scenario ${index}:`, error);
      this.displayError(`Failed to load scenario: ${error.message}`);
      this.currentScenarioData = null;
      this.updateNavigationState();
    }
  }

  renderQuestionsAndSubmit() {
    this.scenarioQuestionsContainer.innerHTML = ''; 
    if (!this.currentScenarioData || !this.currentScenarioData.questions || this.currentScenarioData.questions.length === 0) {
        this.scenarioQuestionsContainer.innerHTML = '<p>This scenario has no questions. You can proceed to the next scenario.</p>';
        this.submittedCurrentScenario = true; 
    } else {
        this.currentScenarioData.questions.forEach((question, questionIndex) => {
            const questionElement = document.createElement('div');
            questionElement.className = 'question-item'; 
            
            const questionHeader = document.createElement('question-header'); 
            questionHeader.setAttribute('title', question.question_text);
            
            const optionsList = document.createElement('div');
            optionsList.className = 'options-list'; 
            
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
        console.warn("AssessmentPage: Scenario already submitted. Ignoring duplicate submit attempt.");
        return;
    }

    const scenarioAnswersPayload = [];
    let allQuestionsAnswered = true;

    if (this.currentScenarioData && this.currentScenarioData.questions && this.currentScenarioData.questions.length > 0) {
        console.log("AssessmentPage: Checking answers for scenario:", this.currentScenarioData.title);
        this.currentScenarioData.questions.forEach((question, qIndex) => {
            const questionElement = this.scenarioQuestionsContainer.querySelectorAll('.question-item')[qIndex];
            let questionAnsweredThisCheck = false;
            if (questionElement) {
                const selectedOptionElement = questionElement.querySelector('answer-option[selected="true"], answer-option[selected]');
                if (selectedOptionElement) {
                    const selectedOptionId = parseInt(selectedOptionElement.getAttribute('option-id'), 10);
                    scenarioAnswersPayload.push({ 
                        question_id: question.question_id, 
                        selected_option_id: selectedOptionId 
                    });
                    questionAnsweredThisCheck = true;
                }
            }
            if (!questionAnsweredThisCheck) {
                allQuestionsAnswered = false; 
                console.log(`AssessmentPage: Question ID ${question.question_id} ('${question.question_text}') is NOT answered.`);
            }
        });

        if (!allQuestionsAnswered) {
            console.log("AssessmentPage: Not all questions answered. Triggering alert.");
            alert('Please answer all questions for this scenario before submitting.'); 
            return;
        }
    } else {
        console.log("AssessmentPage: No questions to submit for this scenario.");
        this.submittedCurrentScenario = true;
        this.updateNavigationState();
        if (this.currentScenario === this.totalScenarios - 1) {
            this.assessmentComplete = true;
            this.updateNavigationState(); 
        }
        return;
    }
    
    console.log("AssessmentPage: All questions answered. Proceeding to submit payload:", scenarioAnswersPayload);
    try {
      const scenarioIndexForAPI = this.currentScenario + 1; 
      // const response = 
      // await ApiService.post('/api/assessment/submit-scenario', {
      //   assessmentId: this.assessmentId,
      //   scenarioIndex: scenarioIndexForAPI,
      //   answers: scenarioAnswersPayload,
      // });

      // console.log(`AssessmentPage: Scenario ${scenarioIndexForAPI} submitted successfully:`, response);
      
      // this.answers.set(this.currentScenario, scenarioAnswersPayload); 
      // this.submittedCurrentScenario = true;
      
      // const submitBtn = this.shadowRoot.querySelector('#submit-scenario');
      // if(submitBtn) {
      //   submitBtn.setAttribute('disabled', 'true');
      //   submitBtn.textContent = 'Answers Submitted';
      // }

      // if (response.isComplete) { 
      //   this.assessmentComplete = true;
      // }
      this.submittedCurrentScenario = true;
      
      this.updateNavigationState(); 

    } catch (error) {
      console.error('AssessmentPage: Error submitting scenario:', error);
      const errorP = document.createElement('p');
      errorP.style.color = 'red';
      errorP.textContent = `Error submitting answers: ${error.message}`;
      if (this.scenarioQuestionsContainer.lastChild.nodeName !== 'P') { 
        this.scenarioQuestionsContainer.appendChild(errorP);
      }
    }
  }

  handleNavigation(e) {
    const { direction } = e.detail;
    console.log(`AssessmentPage: Navigation event - ${direction}`);
    if (direction === 'prev' && this.currentScenario > 0) {
      this.currentScenario--;
      this.assessmentComplete = false; 
      this.loadScenario(this.currentScenario);
    } else if (direction === 'next') {
      const canProceed = this.submittedCurrentScenario || 
                         (this.currentScenarioData && (!this.currentScenarioData.questions || this.currentScenarioData.questions.length === 0));

      if (!canProceed) {
        console.log("AssessmentPage: Cannot navigate next. Current scenario not submitted.");
        alert("Please submit your answers for the current scenario before proceeding.");
        return;
      }

      if (this.currentScenario < this.totalScenarios - 1) {
        this.currentScenario++;
        this.loadScenario(this.currentScenario);
      } else if (this.currentScenario === this.totalScenarios - 1 && canProceed) {
        console.log("AssessmentPage: Last scenario submitted. Finishing assessment.");
        this.assessmentComplete = true; 
        this.finishAssessment();
      }
    }
  }

  updateNavigationState() {
    // if (!this.navControlsElement) return;
    // this.navControlsElement.canGoBack = this.currentScenario > 0 && !this.assessmentComplete;

    // const currentScenarioHasQuestions = this.currentScenarioData && this.currentScenarioData.questions && this.currentScenarioData.questions.length > 0;
    // const canProceedFromCurrent = this.submittedCurrentScenario || !currentScenarioHasQuestions;

    // this.navControlsElement.canGoForward = canProceedFromCurrent && !this.assessmentComplete && this.totalScenarios > 0 && this.currentScenario < this.totalScenarios; // Check currentScenario < totalScenarios
    
    // if (this.currentScenario === this.totalScenarios - 1 && canProceedFromCurrent && this.totalScenarios > 0) {
    //     this.navControlsElement.isLastScenarioAndSubmitted = true; // For "Finish" button text
    // } else {
    //     this.navControlsElement.isLastScenarioAndSubmitted = false;
    // }
    this.navControlsElement.canGoForward = true;
    
    this.navControlsElement.style.display = this.assessmentComplete && (this.currentScenario === this.totalScenarios -1) ? 'none' : '';
    console.log(`AssessmentPage: Updated navigation state - canGoBack: ${this.navControlsElement.canGoBack}, canGoForward: ${this.navControlsElement.canGoForward}, isLast: ${this.navControlsElement.isLastScenarioAndSubmitted}`);
  }

  updateProgressBarText() {
    if (!this.progressBarElement) return;
    this.progressBarElement.setAttribute('total', this.totalScenarios.toString());
    const displayScenarioNumber = this.totalScenarios > 0 ? (this.currentScenario + 1) : 0;
    this.progressBarElement.setAttribute('current', displayScenarioNumber.toString());
  }

  updateProgressBarValue() {
    if (!this.progressBarElement) return;
    const valueToShow = this.totalScenarios > 0 ? (this.currentScenario + 1) : 0;
    this.progressBarElement.setAttribute('value', valueToShow.toString());
  }

  async finishAssessment() {
    console.log("AssessmentPage: Finishing assessment...");
    this.assessmentComplete = true; 
    this.updateNavigationState(); 
    
    this.scenarioTitleElement.textContent = "Assessment Complete!";
    this.scenarioDescriptionElement.textContent = "Thank you for completing the assessment.";
    this.scenarioQuestionsContainer.innerHTML = `<p>You will be redirected to the results page shortly.</p><p><a href="/assessment-results?assessmentId=${this.assessmentId}">View Results Now</a></p>`;
    if (this.progressBarElement) this.progressBarElement.setAttribute('value', this.totalScenarios.toString()); 


    try {
        // Optional: await ApiService.post(`/api/assessment/${this.assessmentId}/finalize`);
    } catch (finalizationError) {
        console.error("AssessmentPage: Error during final assessment finalization call:", finalizationError);
    }
    
    setTimeout(() => {
        window.location.href = `/assessment-results?assessmentId=${this.assessmentId}`;
    }, 3000); 
  }
}

customElements.define('assessment-page', AssessmentPage);

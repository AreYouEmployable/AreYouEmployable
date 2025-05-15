import { createElementAndAppend } from '../utils.js';
import './progress-bar.js';
import './question-header.js';
import './navigation-controls.js';
import './answer-option.js';
import './submit-button.js';
import './labels-indicator.js';

import { ApiService } from '../services/api.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/assessment-page.css' } 
});

const containerSection = createElementAndAppend(template.content, 'section', {
  props: { className: 'container' }
});

createElementAndAppend(containerSection, 'span', {
  props: { textContent: 'ASSESSMENT PROGRESS' },
  classList: ['progress-text']
});

const progressBarElementRef = createElementAndAppend(containerSection, 'progress-bar', {
  attrs: { total: '0', current: '0', value: '0' },
  classList: ['progress-bar', 'mb-6']
});

const scenarioCardArticle = createElementAndAppend(containerSection, 'article', {
  props: { className: 'scenario-card' }
});

const scenarioHeader = createElementAndAppend(scenarioCardArticle, 'header', {
  props: { className: 'scenario-header' }
});

createElementAndAppend(scenarioHeader, 'h2', {
  props: {
    className: 'scenario-title',
    id: 'scenario-title',
    textContent: 'Loading scenario...'
  }
});

createElementAndAppend(scenarioHeader, 'p', {
  props: {
    className: 'scenario-description',
    id: 'scenario-description'
  }
});

createElementAndAppend(scenarioHeader, 'labels-indicator', {
  props: { className: 'scenario-labels' }
});

createElementAndAppend(scenarioCardArticle, 'article', {
  props: {
    className: 'question-block', 
    id: 'scenario-questions'
  },
  classList: ['mt-8']
});

createElementAndAppend(containerSection, 'navigation-controls'); 

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
        createElementAndAppend(this.scenarioQuestionsContainer, 'p', {
            props: { textContent: message },
            style: { color: 'red', fontWeight: 'bold' }
        });
    }
    if (this.navControlsElement) {
      this.navControlsElement.canGoForward = false;
      this.navControlsElement.canGoBack = false;
    }
  }

  async loadScenario(index) {
    if (!this.assessmentId) {
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
        createElementAndAppend(this.scenarioQuestionsContainer, 'p', { props: { textContent: 'Loading scenario content...' }});
    }
    if(this.scenarioDescriptionElement) {
        this.scenarioDescriptionElement.textContent = '';
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
      createElementAndAppend(this.scenarioQuestionsContainer, 'p', {
        props: { textContent: 'This scenario has no questions. You can proceed to the next scenario.' }
      });
      this.submittedCurrentScenario = true;
    } else {
      this.currentScenarioData.questions.forEach((question) => {
        const questionElement = createElementAndAppend(this.scenarioQuestionsContainer, 'section', {
          props: { className: 'question-item' },
          classList: ['mb-4', 'p-4', 'border', 'border-gray-200', 'rounded-lg', 'shadow-sm']
        });

        createElementAndAppend(questionElement, 'question-header', {
          attrs: { title: question.question_text }
        });

        const optionsList = createElementAndAppend(questionElement, 'section', {
          props: { className: 'options-list' },
          classList: ['mt-2']
        });

        question.options.forEach((option) => {
          const answerOption = createElementAndAppend(optionsList, 'answer-option', {
            props: { text: option.value, label: option.label },
            attrs: {
              'option-id': option.option_id.toString(),
              name: `question_${question.question_id}`
            }
          });

          const savedScenarioAnswers = this.answers.get(this.currentScenario);
          if (savedScenarioAnswers) {
            const savedQuestionAnswer = savedScenarioAnswers.find(a => a.question_id === question.question_id);
            if (savedQuestionAnswer && savedQuestionAnswer.selected_option_id === option.option_id) {
              answerOption.selected = true;
            }
          }
        });
      });

      const submitButton = createElementAndAppend(this.scenarioQuestionsContainer, 'submit-button', {
        props: {
          id: 'submit-scenario',
          textContent: this.submittedCurrentScenario ? 'Answers Submitted' : 'Submit Answers',
        },
        attrs: {
            disabled: this.submittedCurrentScenario ? 'true' : null
        },
        classList: ['mt-4'],
        callbacks: { click: this.handleScenarioSubmit.bind(this) }
      });
      if (submitButton) submitButton.disabled = this.submittedCurrentScenario;
    }
  }

  async handleScenarioSubmit(e) {
    if (e) e.preventDefault();
    if (this.submittedCurrentScenario) return;

    const scenarioAnswersPayload = [];
    let allQuestionsAnswered = true;

    if (this.currentScenarioData && this.currentScenarioData.questions && this.currentScenarioData.questions.length > 0) {
      this.shadowRoot.querySelectorAll('.question-item').forEach((questionItemElement, qIndex) => {
          let questionAnsweredThisCheck = false;
          const question = this.currentScenarioData.questions[qIndex];
          const selectedOptionElement = questionItemElement.querySelector('answer-option[selected="true"], answer-option[selected]');
          if (selectedOptionElement) {
              const selectedOptionId = parseInt(selectedOptionElement.getAttribute('option-id'), 10);
              if (!isNaN(selectedOptionId)) {
                  scenarioAnswersPayload.push({
                      question_id: question.question_id,
                      selected_option_id: selectedOptionId
                  });
                  questionAnsweredThisCheck = true;
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
        submitBtn.disabled = true;
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
      const submitBtn = this.shadowRoot.querySelector('#submit-scenario');
      if (submitBtn && submitBtn.parentNode) {
          createElementAndAppend(submitBtn.parentNode, 'p', {
              props: { textContent: `Error submitting answers: ${error.message}` },
              style: { color: 'red', marginTop: '0.5rem' }
          });
      } else if (this.scenarioQuestionsContainer) {
          createElementAndAppend(this.scenarioQuestionsContainer, 'p', {
              props: { textContent: `Error submitting answers: ${error.message}` },
              style: { color: 'red' }
          });
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
      const currentScenarioHasQuestions = this.currentScenarioData &&
                                          this.currentScenarioData.questions &&
                                          this.currentScenarioData.questions.length > 0;
      const canProceed = this.submittedCurrentScenario || !currentScenarioHasQuestions;

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
                                           this.currentScenario < this.totalScenarios &&
                                           !this.assessmentComplete &&
                                           this.totalScenarios > 0;


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
    const completedCount = this.answers.size;
    this.progressBarElement.setAttribute('current', completedCount.toString());
    this.progressBarElement.setAttribute('value', completedCount.toString());
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
        createElementAndAppend(this.scenarioQuestionsContainer, 'p', {
            props: { textContent: 'You will be redirected to the results page shortly.'},
            classList: ['text-lg', 'text-gray-700']
        });
        const resultsLinkP = createElementAndAppend(this.scenarioQuestionsContainer, 'p', { classList: ['mt-2']});
        createElementAndAppend(resultsLinkP, 'a', {
            props: {
                href: `/assessment-results?assessmentId=${this.assessmentId}`,
                textContent: 'View Results Now'
            },
            classList: ['text-blue-600', 'hover:underline']
        });
    }
    if (this.progressBarElement) {
        this.progressBarElement.setAttribute('current', this.totalScenarios.toString());
        this.progressBarElement.setAttribute('value', this.totalScenarios.toString());
    }

    try {
      await ApiService.post(`/api/assessment/submit/${this.assessmentId}`, { status: 'completed' });
    } catch (finalizationError) {
      console.error("AssessmentPage: Error during final assessment finalization call:", finalizationError);
    }

    setTimeout(() => {
      if (this.assessmentId) {
        window.location.href = `/assessment-results?assessmentId=${this.assessmentId}`;
      } else {
        console.error("AssessmentPage: Cannot redirect, assessmentId is missing.");
         if(this.scenarioQuestionsContainer && !this.scenarioQuestionsContainer.querySelector('.error-redirect')) {
            createElementAndAppend(this.scenarioQuestionsContainer, 'p', {
                props: { textContent: "Could not redirect: Assessment ID is missing." },
                style: { color: 'red', marginTop: '1rem' },
                classList: ['error-redirect']
            });
         }
      }
    }, 3000);
  }
}

customElements.define('assessment-page', AssessmentPage);

import { ApiService } from '../services/api.js';
import { router } from '../router.js';


function createHtmlElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.classes) {
    element.classList.add(...options.classes);
  }

  if (options.attributes) {
    for (const [key, value] of Object.entries(options.attributes)) {
      element.setAttribute(key, value);
    }
  }

  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      element.dataset[key] = value;
    }
  }

  if (typeof options.text === 'string') {
    element.textContent = options.text;
  }

  if (options.children) {
    options.children.forEach(child => {
      if (child instanceof Node) {
        element.appendChild(child);
      }
    });
  }

  if (typeof options.onClick === 'function') {
    element.addEventListener('click', options.onClick);
  }

  return element;
}

class AssessmentHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.setAttribute('href', '/styles/components/assessment-history.css'); 
    this.shadowRoot.appendChild(linkEl);

    const main = createHtmlElement('main');

    const header = createHtmlElement('header', {
      children: [createHtmlElement('h1', { text: 'Assessment History' })],
    });

    this.assessmentsSection = createHtmlElement('section', {
      attributes: { id: 'assessments' },
    });

    main.appendChild(header);
    main.appendChild(this.assessmentsSection);
    this.shadowRoot.appendChild(main);
  }

  connectedCallback() {
    this.fetchAssessmentHistory();
  }

  async fetchAssessmentHistory() {
    try {
      const response = await ApiService.get('/api/assessments/history');

      if (response?.status === 'success' && response.data) {
        this.renderAssessments(response.data);
      } else {
        console.error('Failed to fetch assessment history:', response?.message || 'Network error');
        this.showMessage('Error loading assessment history.');
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      this.showMessage('Error loading assessment history.');
    }
  }

  showMessage(message) {
    this.assessmentsSection.innerHTML = '';
    const messageElement = createHtmlElement('p', { text: message });
    this.assessmentsSection.appendChild(messageElement);
  }

  renderAssessments(assessmentsData) {
    this.assessmentsSection.innerHTML = '';

    if (!assessmentsData || assessmentsData.length === 0) {
      this.showMessage('No assessment history available.');
      return;
    }

    assessmentsData.forEach(assessment => {
      const scorePercentage = (assessment.total_score / 100) * 100;
      let employabilityRating = '';
      let statusClass = '';

      if (scorePercentage >= 80) {
        employabilityRating = 'Highly Employable';
        statusClass = 'highly-employable';
      } else if (scorePercentage >= 60) {
        employabilityRating = 'Employable';
        statusClass = 'employable';
      } else if (scorePercentage >= 40) {
        employabilityRating = 'Needs Improvement';
        statusClass = 'needs-improvement';
      } else {
        employabilityRating = 'Not Employable';
        statusClass = 'not-employable';
      }

      const statusElement = createHtmlElement('strong', {
        classes: ['status', statusClass],
        text: employabilityRating,
      });

      const scoreElement = createHtmlElement('p', {
        classes: ['total-score'],
        text: `Score: ${assessment.total_score}%`,
      });

      const viewButton = createHtmlElement('button', {
        attributes: { type: 'button' },
        dataset: { assessmentId: assessment.assessment_id },
        text: 'View',
        onClick: () => {
          router.navigateTo(`/results?assessmentId=${assessment.assessment_id}`);
        },
      });

      const articleElement = createHtmlElement('article', {
        children: [statusElement, scoreElement, viewButton],
      });

      this.assessmentsSection.appendChild(articleElement);
    });
  }
}

customElements.define('assessment-history', AssessmentHistory);

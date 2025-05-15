import { ApiService } from '../services/api.js';
import { router } from '../router.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    main {
      max-width: 700px;
      margin: 0 auto;
      margin-top: 6rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      background-color: white;
    }
    
    header {
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }
      
    
    article {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      margin-bottom: 10px;
      border-radius: 8px;
      background-color: #f9fafb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    article:hover {
      background-color: #f1f3f5;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      transition: background-color 0.3s, box-shadow 0.3s;
    }
    
    .status {
      font-weight: bold;
      width: 100px;
    }
    
    .highly-employable {
      color:rgb(27, 114, 255); /* Bootstrap success color */
    }

    .employable {
      color: #51cf66; /* Slightly darker success color */
    }

    .needs-improvement {
      color: #ffc107; /* Bootstrap warning color */
    }

    .not-employable {
      color: #ff6b6b; /* Bootstrap danger color */
    }
    
    .percentage {
      flex-grow: 1;
      text-align: center;
      font-size: 16px;
      margin: 0;
    }
    
    button {
      background-color: #2563EB;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    }
    
    button:hover {
      background-color: #339af0;
    }
  </style>
  <main>
    <header>
        <h1>Assessment History</h1>
    </header>
    
    <section id="assessments"></section>
  </main>
`;

class AssessmentHistory extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.assessmentsSection = this.shadowRoot.querySelector('#assessments');
  }

  connectedCallback() {
    this.renderAssessments();
  }

  async connectedCallback() {
    await this.fetchAssessmentHistory();
  }

  async fetchAssessmentHistory() {
    try {
      const response = await ApiService.get('/api/assessments/history');

      if (response && response.status === 'success' && response.data) {
        this.renderAssessments(response.data);
      } else {
        console.error('Failed to fetch assessment history:', response ? response.message : 'Network error');
        this.assessmentsSection.innerHTML = `<p>Error loading assessment history.</p>`;
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
      this.assessmentsSection.innerHTML = `<p>Error loading assessment history.</p>`;
    }
  }

  renderAssessments(assessmentsData) {
    this.assessmentsSection.innerHTML = '';

    if (!assessmentsData || assessmentsData.length === 0) {
      this.assessmentsSection.innerHTML = `<p>No assessment history available.</p>`;
      return;
    }

    assessmentsData.forEach(assessment => {
      const assessmentArticle = document.createElement('article');
      const scorePercentage = (assessment.total_score / 100) * 100;
      let employabilityRating = "";
      let statusClass = "";

      if (scorePercentage >= 80) {
        employabilityRating = "Highly Employable";
        statusClass = "highly-employable";
      } else if (scorePercentage >= 60) {
        employabilityRating = "Employable";
        statusClass = "employable";
      } else if (scorePercentage >= 40) {
        employabilityRating = "Needs Improvement";
        statusClass = "needs-improvement";
      } else {
        employabilityRating = "Not Employable";
        statusClass = "not-employable";
      }

      assessmentArticle.innerHTML = `
        <strong class="status ${statusClass}">${employabilityRating}</strong>
        <p class="total-score">Score: ${assessment.total_score}</p>
        <button type="button" data-assessment-id="${assessment.assessment_id}">View</button>
      `;
      this.assessmentsSection.appendChild(assessmentArticle);

      const viewButton = assessmentArticle.querySelector('button');
      viewButton.addEventListener('click', () => {
        router.navigateTo(`/results?assessmentId=${assessment.assessment_id}`)
      });
    });
  }
}

customElements.define('assessment-history', AssessmentHistory);
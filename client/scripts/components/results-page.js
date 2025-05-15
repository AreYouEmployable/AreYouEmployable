import "./results-progress-card.js";
import "./results-summary-card.js";
import "./dynamic-button.js";
import "./progress-bar.js";

const template = document.createElement("template");

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/results-page.css');
template.content.appendChild(stylesheetLink);

const resultsContainer = document.createElement('section');
resultsContainer.classList.add('results-container');

const h1Title = document.createElement('h1');
h1Title.textContent = 'Your Assessment Results';
resultsContainer.appendChild(h1Title);

const ratingCard = document.createElement('results-summary-card');
ratingCard.id = 'rating-card';
resultsContainer.appendChild(ratingCard);

const overallScoreSection = document.createElement('section');
overallScoreSection.classList.add('overall-score');
const overallScoreCard = document.createElement('results-progress-card');
overallScoreCard.id = 'overall-score-card';
overallScoreSection.appendChild(overallScoreCard);
resultsContainer.appendChild(overallScoreSection);

const h4CategoryBreakdown = document.createElement('h4');
h4CategoryBreakdown.id = 'category-breakdown';
h4CategoryBreakdown.textContent = 'Category Breakdown';
resultsContainer.appendChild(h4CategoryBreakdown);

const categoryGridSection = document.createElement('section');
categoryGridSection.classList.add('category-grid');
const categoryCardIds = ['technical-card', 'communication-card', 'problem-solving-card', 'soft-skills-card'];
categoryCardIds.forEach(id => {
    const card = document.createElement('results-progress-card');
    card.id = id;
    categoryGridSection.appendChild(card);
});
resultsContainer.appendChild(categoryGridSection);

const summarySection = document.createElement('section');
summarySection.classList.add('summary-section');
const strengthsCard = document.createElement('results-summary-card');
strengthsCard.id = 'strengths-card';
summarySection.appendChild(strengthsCard);
const improvementsCard = document.createElement('results-summary-card');
improvementsCard.id = 'improvements-card';
summarySection.appendChild(improvementsCard);
resultsContainer.appendChild(summarySection);

const actionsSection = document.createElement('section');
actionsSection.classList.add('actions');

const takeAssessmentAgainButton = document.createElement('dynamic-button');
takeAssessmentAgainButton.setAttribute('text', 'Take Assessment Again');
takeAssessmentAgainButton.setAttribute('bg-color', '#2563eb');
takeAssessmentAgainButton.setAttribute('text-color', '#ffffff');
takeAssessmentAgainButton.setAttribute('clickable', 'true');
takeAssessmentAgainButton.setAttribute('active', 'true');
takeAssessmentAgainButton.setAttribute('on-click', 'retestClicked');
actionsSection.appendChild(takeAssessmentAgainButton);

const shareResultsButton = document.createElement('dynamic-button');
shareResultsButton.setAttribute('text', 'Share Results');
shareResultsButton.setAttribute('bg-color', '#F3F4F6');
shareResultsButton.setAttribute('text-color', '#384252');
shareResultsButton.setAttribute('clickable', 'true');
shareResultsButton.setAttribute('active', 'true');
shareResultsButton.setAttribute('on-click', 'shareClicked');
actionsSection.appendChild(shareResultsButton);

resultsContainer.appendChild(actionsSection);
template.content.appendChild(resultsContainer);

class ResultsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const mockResults = {
      employabilityRating: "Needs Improvement",
      feedback:
        "You have foundational software engineering knowledge but need to strengthen several key areas before being ready for professional roles.",
      totalScore: 15,
      maxPossibleScore: 15, // Assuming totalScore should not exceed maxPossibleScore for 100%
      categoryScores: {
        technical: { score: 4, maxScore: 6 },
        communication: { score: 2, maxScore: 3 },
        problemSolving: { score: 1, maxScore: 3 },
        softSkills: { score: 3, maxScore: 3 },
      },
      strengths: [
        "Reliable and consistent",
        "Strong collaboration",
        "Empathetic leadership",
      ],
      areasToImprove: ["Clear and constructive communication"],
    };

    // Update employability summary
    const ratingCardEl = this.shadowRoot.querySelector("#rating-card");
    const colors = {
      "Highly Employable": { bg: "#d1fae5", title: "#065f46", description: "" },
      Employable: { bg: "#dbeafe", title: "#1e3a8a", description: "" },
      "Needs Improvement": { bg: "#fef3c7", title: "#92400e", description: "" },
      "Not Ready": { bg: "#fee2e2", title: "#991b1b", description: "" },
    };
    const ratingStyle = colors[mockResults.employabilityRating] || { bg: "#E5E7EB", title: "#4B5563" }; // Default style
    ratingCardEl.setAttribute("title", mockResults.employabilityRating);
    ratingCardEl.setAttribute("title-color", ratingStyle.title);
    ratingCardEl.setAttribute("background", ratingStyle.bg);
    ratingCardEl.setAttribute("items", mockResults.feedback);
    ratingCardEl.setAttribute("item-color", ratingStyle.title);
    ratingCardEl.setAttribute("title-icon", mockResults.employabilityRating.toLowerCase().includes("employable") ? "✅" : "⚠️"
    );

    // Populate Overall Score Progress Card
    const overallCard = this.shadowRoot.querySelector("#overall-score-card");
    overallCard.setAttribute("category", "Overall Score");
    overallCard.setAttribute("current", mockResults.totalScore.toString());
    overallCard.setAttribute("total", mockResults.maxPossibleScore.toString());
    overallCard.setAttribute("color", this.getScoreColor(mockResults.totalScore, mockResults.maxPossibleScore));

      // Populate Category Breakdown Progress Cards
      this.populateCategoryCard(
        "#technical-card",
        "Technical Skills",
        mockResults.categoryScores.technical
      );
      this.populateCategoryCard(
        "#communication-card",
        "Communication",
        mockResults.categoryScores.communication
      );
      this.populateCategoryCard(
        "#problem-solving-card",
        "Problem Solving",
        mockResults.categoryScores.problemSolving
      );
      this.populateCategoryCard(
        "#soft-skills-card",
        "Soft Skills",
        mockResults.categoryScores.softSkills
      );

    // Populate Strengths and Areas to Improve
    const strengthsCardEl = this.shadowRoot.querySelector("#strengths-card");
    strengthsCardEl.setAttribute("title", "Your Strengths");
    strengthsCardEl.setAttribute("title-color", "#065f46");
    strengthsCardEl.setAttribute("title-icon", "✅");
    strengthsCardEl.setAttribute("background", "#F0FDF4");
    strengthsCardEl.setAttribute("items", mockResults.strengths.join("|"));
    strengthsCardEl.setAttribute("item-icon", "✔️");


    const improvementsCardEl = this.shadowRoot.querySelector("#improvements-card");
    improvementsCardEl.setAttribute("title", "Areas to Improve");
    improvementsCardEl.setAttribute("title-color", "#92400E");
    improvementsCardEl.setAttribute("title-icon", "⚠️");
    improvementsCardEl.setAttribute("background", "#FFFBEB");
    improvementsCardEl.setAttribute("items", mockResults.areasToImprove.join("|"));
    improvementsCardEl.setAttribute("item-icon", "⚠️");

    // Add event listeners for buttons
    this.shadowRoot.querySelectorAll('dynamic-button').forEach(button => {
        const eventName = button.getAttribute('on-click');
        if (eventName === 'retestClicked') {
            button.addEventListener('retestClicked', () => {
                // Handle retest logic, e.g., navigate to assessment page
                console.log('Retest clicked');
                // window.location.href = '/assessment';
            });
        } else if (eventName === 'shareClicked') {
            button.addEventListener('shareClicked', () => {
                // Handle share logic
                console.log('Share clicked');
                // navigator.share({ title: 'My Assessment Results', text: 'Check out my employability assessment results!', url: window.location.href });
            });
        }
    });
  }

  populateCategoryCard(id, category, scores) {
    console.log(scores);
    const categoryIcons = {
      technicalskills: "🧠",
      communication: "💬",
      problemsolving: "🧩",
      softskills: "🤝",
    };

    const key = category.replace(/\s+/g, '').toLowerCase();
    const icon = categoryIcons[key] || "❓";

    const card = this.shadowRoot.querySelector(id);
    if (card) {
        card.setAttribute("category", category);
        card.setAttribute("current", scores.score.toString());
        card.setAttribute("total", scores.maxScore.toString());
        card.setAttribute("icon", icon);
        card.setAttribute("color", this.getScoreColor(scores.score, scores.maxScore));
    } else {
        console.warn(`Element with ID ${id} not found for category card.`);
    }
  }

  getScoreColor(score, maxScore) {
    if (maxScore === 0) return "#9ca3af"; // gray for no score/maxScore
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "#10b981"; // green
    if (percentage >= 60) return "#3b82f6"; // blue
    if (percentage >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  }
}

customElements.define("results-page", ResultsPage);

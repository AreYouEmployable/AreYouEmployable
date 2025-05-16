import "./results-progress-card.js";
import "./results-summary-card.js";
import "./dynamic-button.js";
import "./progress-bar.js";
import { ApiService } from "../services/api.js";

const template = document.createElement("template");

const stylesheetLink = document.createElement("link");
stylesheetLink.setAttribute("rel", "stylesheet");
stylesheetLink.setAttribute("href", "/styles/components/results-page.css");
template.content.appendChild(stylesheetLink);

const resultsContainer = document.createElement("section");
resultsContainer.classList.add("results-container");

const h1Title = document.createElement("h1");
h1Title.textContent = "Your Assessment Results";
resultsContainer.appendChild(h1Title);

const ratingCard = document.createElement("results-summary-card");
ratingCard.id = "rating-card";
resultsContainer.appendChild(ratingCard);

const overallScoreSection = document.createElement("section");
overallScoreSection.classList.add("overall-score");
const overallScoreCard = document.createElement("results-progress-card");
overallScoreCard.id = "overall-score-card";
overallScoreSection.appendChild(overallScoreCard);
resultsContainer.appendChild(overallScoreSection);

const h4CategoryBreakdown = document.createElement("h4");
h4CategoryBreakdown.id = "category-breakdown";
h4CategoryBreakdown.textContent = "Category Breakdown";
resultsContainer.appendChild(h4CategoryBreakdown);

const categoryGridSection = document.createElement("section");
categoryGridSection.classList.add("category-grid");
const categoryCardIds = [
  "technical-card",
  "communication-card",
  "problem-solving-card",
  "soft-skills-card",
];
categoryCardIds.forEach((id) => {
  const card = document.createElement("results-progress-card");
  card.id = id;
  categoryGridSection.appendChild(card);
});
resultsContainer.appendChild(categoryGridSection);

const summarySection = document.createElement("section");
summarySection.classList.add("summary-section");
const strengthsCard = document.createElement("results-summary-card");
strengthsCard.id = "strengths-card";
summarySection.appendChild(strengthsCard);
const improvementsCard = document.createElement("results-summary-card");
improvementsCard.id = "improvements-card";
summarySection.appendChild(improvementsCard);
resultsContainer.appendChild(summarySection);

template.content.appendChild(resultsContainer);

class ResultsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const assessmentId = urlParams.get("assessmentId");

    if (!assessmentId) {
      console.error(
        "AssessmentResults: Cannot load results: assessmentId is not set."
      );
      this.displayError("Assessment ID is missing. Cannot load results.");
      return;
    }

    const response = await ApiService.get(
      `/api/assessments/${assessmentId}/results`
    );

    const assessmentResults = response.data;

    const ratingCardEl = this.shadowRoot.querySelector("#rating-card");

    function getScoreFeedbackRatings(score, maxScore) {
      const percentage = (score / maxScore) * 100;
      if (percentage >= 80) return "Highly Employable";
      if (percentage >= 60) return "Employable";
      if (percentage >= 40) return "Needs Improvement";
      return "Not Employable";
    }

    const colors = {
      "Highly Employable": {
        bg: "#d1fae5",
        title: "#065f46",
      },
      Employable: {
        bg: "#d1fae5",
        title: "#065f46",
      },
      "Needs Improvement": {
        bg: "#fef3c7",
        title: "#92400e",
      },
      "Not Employable": {
        bg: "#fee2e2",
        title: "#991b1b",
      },
    };

    const score = assessmentResults.totalScore;
    const maxScore = assessmentResults.maxPossibleScore;
    const rating = getScoreFeedbackRatings(score, maxScore);
    const ratingStyle = colors[rating] || { bg: "#E5E7EB", title: "#4B5563" }; // Default style

    ratingCardEl.setAttribute("title", assessmentResults.employabilityRating);
    ratingCardEl.setAttribute("title-color", ratingStyle.title);
    ratingCardEl.setAttribute("background", ratingStyle.bg);
    ratingCardEl.setAttribute("items", assessmentResults.feedback);
    ratingCardEl.setAttribute("item-color", ratingStyle.title);
    ratingCardEl.setAttribute(
      "title-icon",
      rating.includes("Not Employable") || rating.includes("Needs Improvement")
        ? "⚠️"
        : "✅"
    );

    // Populate Overall Score Progress Card
    const overallCard = this.shadowRoot.querySelector("#overall-score-card");
    overallCard.setAttribute("category", "Overall Score");
    overallCard.setAttribute(
      "current",
      assessmentResults.totalScore.toString()
    );
    overallCard.setAttribute(
      "total",
      assessmentResults.maxPossibleScore.toString()
    );
    overallCard.setAttribute(
      "color",
      this.getScoreColor(
        assessmentResults.totalScore,
        assessmentResults.maxPossibleScore
      )
    );

    // Populate Category Breakdown Progress Cards
    this.populateCategoryCard(
      "#technical-card",
      "Technical Skills",
      assessmentResults.categoryScores.technical
    );
    this.populateCategoryCard(
      "#communication-card",
      "Communication",
      assessmentResults.categoryScores.communication
    );
    this.populateCategoryCard(
      "#problem-solving-card",
      "Problem Solving",
      assessmentResults.categoryScores.problemsolving
    );
    this.populateCategoryCard(
      "#soft-skills-card",
      "Soft Skills",
      assessmentResults.categoryScores.softskills
    );

    // Populate Strengths and Areas to Improve
    const strengthsCardEl = this.shadowRoot.querySelector("#strengths-card");
    strengthsCardEl.setAttribute("title", "Your Strengths");
    strengthsCardEl.setAttribute("title-color", "#065f46");
    strengthsCardEl.setAttribute("title-icon", "✅");
    strengthsCardEl.setAttribute("background", "#F0FDF4");
    strengthsCardEl.setAttribute(
      "items",
      assessmentResults.strengths.join("|")
    );
    strengthsCardEl.setAttribute("item-icon", "✔️");

    const improvementsCardEl =
      this.shadowRoot.querySelector("#improvements-card");
    improvementsCardEl.setAttribute("title", "Areas to Improve");
    improvementsCardEl.setAttribute("title-color", "#92400E");
    improvementsCardEl.setAttribute("title-icon", "⚠️");
    improvementsCardEl.setAttribute("background", "#FFFBEB");
    improvementsCardEl.setAttribute(
      "items",
      assessmentResults.areasToImprove.join("|")
    );
    improvementsCardEl.setAttribute("item-icon", "⚠️");

  }

  populateCategoryCard(id, category, scores) {
    const categoryIcons = {
      technicalskills: "🧠",
      communication: "💬",
      problemsolving: "🧩",
      softskills: "🤝",
    };

    const key = category.replace(/\s+/g, "").toLowerCase();
    const icon = categoryIcons[key] || "❓";

    const card = this.shadowRoot.querySelector(id);
    if (card) {
      card.setAttribute("category", category);
      card.setAttribute("current", scores.score);
      card.setAttribute("total", scores.maxScore.toString());
      card.setAttribute("icon", icon);
      card.setAttribute(
        "color",
        this.getScoreColor(scores.score, scores.maxScore)
      );
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

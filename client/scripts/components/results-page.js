import "./results-progress-card.js";
import "./results-summary-card.js";
import "./dynamic-button.js";
import "./progress-bar.js";
import { ApiService } from "../services/api.js";
import { AuthService } from "../services/auth.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/results-page.css">
  <section class="loading" id="loading-message">Loading your results...</section>
  <section class="results-container">
    <h1>Your Assessment Results</h1>

    <results-summary-card id="rating-card"></results-summary-card>

    <section class="overall-score">
      <results-progress-card id="overall-score-card"></results-progress-card>
    </section>

    <h4 id="category-breakdown">Category Breakdown</h4>
    <section class="category-grid">
      <results-progress-card id="technical-card"></results-progress-card>
      <results-progress-card id="communication-card"></results-progress-card>
      <results-progress-card id="problem-solving-card"></results-progress-card>
      <results-progress-card id="soft-skills-card"></results-progress-card>
    </section>

    <section class="summary-section">
      <results-summary-card id="strengths-card"></results-summary-card>
      <results-summary-card id="improvements-card"></results-summary-card>
    </section>

   
  </section>
`;
class ResultsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const assessmentId = urlParams.get("assessmentId");
      console.log("Assessment id:" + assessmentId);

      if (!assessmentId) {
        console.error(
          "AssessmentResults: Cannot load results: assessmentId is not set."
        );
        this.displayError("Assessment ID is missing. Cannot load results.");
        return;
      }

      // const response = await ApiService.get(
      //   `/api/assessments/${assessmentId}/results`
      // );

      // // console.log(response.data);
      // const assessmentResults = response.data;

      const mockResults = {
        employabilityRating: "Needs Improvement",
        feedback:
          "You have foundational software engineering knowledge but need to strengthen several key areas before being ready for professional roles.",
        totalScore: 14,
        maxPossibleScore: 15,
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
      const ratingCard = this.shadowRoot.querySelector("#rating-card");

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

      const score = mockResults.totalScore;
      const maxScore = mockResults.maxPossibleScore;
      const rating = getScoreFeedbackRatings(score, maxScore);
      const ratingStyle = colors[rating] || {};

      ratingCard.setAttribute("title", rating);
      ratingCard.setAttribute("title-color", ratingStyle.title);
      ratingCard.setAttribute("background", ratingStyle.bg);
      ratingCard.setAttribute("items", mockResults.feedback);
      ratingCard.setAttribute("item-color", ratingStyle.title);
      ratingCard.setAttribute(
        "title-icon",
        rating.includes("Not Employable") ||
          rating.includes("Needs Improvement")
          ? "⚠️"
          : "✅"
      );

      // Populate Overall Score Progress Card
      const overallCard = this.shadowRoot.querySelector("#overall-score-card");
      overallCard.setAttribute("category", "Overall Score");
      overallCard.setAttribute("current", mockResults.totalScore);
      overallCard.setAttribute("total", mockResults.maxPossibleScore);
      overallCard.setAttribute(
        "color",
        this.getScoreColor(mockResults.totalScore, mockResults.maxPossibleScore)
      );

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
      const strengthsCard = this.shadowRoot.querySelector("#strengths-card");
      strengthsCard.setAttribute("title", "Your Strengths");
      strengthsCard.setAttribute("title-color", "#065f46");
      strengthsCard.setAttribute("title-icon", "✅");
      strengthsCard.setAttribute("background", "#F0FDF4");
      strengthsCard.setAttribute("items", mockResults.strengths.join("|"));
      strengthsCard.setAttribute("item-icon", "✔️");

      const improvementsCard =
        this.shadowRoot.querySelector("#improvements-card");
      improvementsCard.setAttribute("title", "Areas to Improve");
      improvementsCard.setAttribute("title-color", "#92400E");
      improvementsCard.setAttribute("title-icon", "⚠️");
      improvementsCard.setAttribute("background", "#FFFBEB");
      improvementsCard.setAttribute(
        "items",
        mockResults.areasToImprove.join("|")
      );
      improvementsCard.setAttribute("item-icon", "⚠️");

      this.shadowRoot.getElementById("loading-message").classList.add("hidden");
      this.shadowRoot
        .getElementById("results-content")
        .classList.remove("hidden");
    } catch (error) {
      console.error("Failed to load assessment results:", error);
      this.shadowRoot.getElementById("loading-message").textContent =
        "Failed to load results. Please try again later.";
    }
  }

  populateCategoryCard(id, category, scores) {
    console.log(scores);
    const categoryIcons = {
      technicalskills: "🧠",
      communication: "💬",
      problemsolving: "🧩",
      softskills: "🤝",
    };

    // Normalize category key (remove spaces and lowercase)
    const key = category.replace(/\s+/g, "").toLowerCase();
    const icon = categoryIcons[key] || "❓";

    const card = this.shadowRoot.querySelector(id);
    card.setAttribute("category", category);
    card.setAttribute("current", scores.score);
    card.setAttribute("total", scores.maxScore);
    card.setAttribute("icon", icon);
    card.setAttribute(
      "color",
      this.getScoreColor(parseInt(scores.score), parseInt(scores.maxScore))
    );
  }

  getScoreColor(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "#10b981"; // green
    if (percentage >= 60) return "#3b82f6"; // blue
    if (percentage >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  }
}

customElements.define("results-page", ResultsPage);

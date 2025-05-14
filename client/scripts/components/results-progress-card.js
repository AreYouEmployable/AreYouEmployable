import "./progress-bar.js";

const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/results-progress-card.css">
  <article class="card">
    <header class="header">
        <i class="header-icon" aria-hidden="true"></i>
        <label class="category">Category</label>
    </header>

    <section class="score-line" aria-label="Score">
        <label class="score" id="score">0%</label>
        <label id="score-detail">(0/0)</label>
    </section>

    <progress-bar id="progress" current="2" total="5" color="red"></progress-bar>
  </article>
`;

class ResultsProgressCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const current = parseInt(this.getAttribute("current") || "0");
    const total = parseInt(this.getAttribute("total") || "1");
    const category = this.getAttribute("category") || "Category";
    const icon = this.getAttribute("icon") || "";
    const color = this.getAttribute("color") || "#10b981";
    const scoreColor = this.getAttribute("score-color") || color;

    const percent = Math.round((current / total) * 100);
    const progress = this.shadowRoot.getElementById("progress");
    const score = this.shadowRoot.getElementById("score");
    const detail = this.shadowRoot.getElementById("score-detail");

    const headerIcon = this.shadowRoot.querySelector(".header-icon");
    const header = this.shadowRoot.querySelector(".header");

    this.shadowRoot.querySelector(".category").textContent = category;

    if (icon.trim()) {
      headerIcon.textContent = icon;
      headerIcon.style.display = "inline-block";
    } else {
      headerIcon.style.display = "none";
    }

    progress.setAttribute("current", current);
    progress.setAttribute("total", total);
    progress.setAttribute("color", color);

    score.textContent = `${percent}%`;
    score.style.color = scoreColor;
    detail.textContent = `(${current}/${total})`;
  }
}

customElements.define("results-progress-card", ResultsProgressCard);

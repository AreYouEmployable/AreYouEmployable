import "./progress-bar.js";

const template = document.createElement("template");

const stylesheetLink = document.createElement("link");
stylesheetLink.setAttribute("rel", "stylesheet");
stylesheetLink.setAttribute(
  "href",
  "/styles/components/results-progress-card.css"
);
template.content.appendChild(stylesheetLink);

const articleElement = document.createElement("article");
articleElement.classList.add("card");

const headerElement = document.createElement("header");
headerElement.classList.add("header");

const iconElement = document.createElement("i");
iconElement.classList.add("header-icon");
iconElement.setAttribute("aria-hidden", "true");
headerElement.appendChild(iconElement);

const categoryLabel = document.createElement("label");
categoryLabel.classList.add("category");
categoryLabel.textContent = "Category";
headerElement.appendChild(categoryLabel);
articleElement.appendChild(headerElement);

const scoreLineSection = document.createElement("section");
scoreLineSection.classList.add("score-line");
scoreLineSection.setAttribute("aria-label", "Score");

const scoreLabel = document.createElement("label");
scoreLabel.classList.add("score");
scoreLabel.id = "score";
scoreLabel.textContent = "0%";
scoreLineSection.appendChild(scoreLabel);

const scoreDetailLabel = document.createElement("label");
scoreDetailLabel.id = "score-detail";
scoreDetailLabel.textContent = "(0/0)";
scoreLineSection.appendChild(scoreDetailLabel);
articleElement.appendChild(scoreLineSection);

const progressBarElement = document.createElement("progress-bar");
progressBarElement.id = "progress";
progressBarElement.setAttribute("current", "2");
progressBarElement.setAttribute("total", "5");
progressBarElement.setAttribute("color", "red");
articleElement.appendChild(progressBarElement);

template.content.appendChild(articleElement);

class ResultsProgressCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["current", "total", "category", "icon", "color", "score-color"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // Optionally handle each attribute individually
    if (oldValue !== newValue) {
      this.updateAttributes();
      // You could also update only what changed for better performance
    }
  }

  updateAttributes() {
    this.current = parseInt(this.getAttribute("current") || "0");
    this.total = parseInt(this.getAttribute("total") || "1");
    this.category = this.getAttribute("category") || "Category";
    this.icon = this.getAttribute("icon") || "";
    this.color = this.getAttribute("color") || "#10b981";
    this.scoreColor = this.getAttribute("score-color") || this.color;

    // Update the UI or internal state accordingly
    this.render();
  }

  render() {
    // Implement your rendering logic using `this.current`, `this.total`, etc.
  }

  connectedCallback() {
    this.render();
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

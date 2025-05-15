import { createElementAndAppend } from '../utils.js';
import "./progress-bar.js";

const template = document.createElement("template");

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/results-progress-card.css' }
});

const articleElement = createElementAndAppend(template.content, 'article', {
  classList: ['card']
});

const headerElement = createElementAndAppend(articleElement, 'header', {
  classList: ['header']
});

createElementAndAppend(headerElement, 'i', {
  classList: ['header-icon'],
  attrs: { 'aria-hidden': 'true' }
});

createElementAndAppend(headerElement, 'label', {
  props: { textContent: 'Category' },
  classList: ['category']
});

const scoreLineSection = createElementAndAppend(articleElement, 'section', {
  classList: ['score-line'],
  attrs: { 'aria-label': 'Score' }
});

createElementAndAppend(scoreLineSection, 'label', {
  props: { id: 'score', textContent: '0%' },
  classList: ['score']
});

createElementAndAppend(scoreLineSection, 'label', {
  props: { id: 'score-detail', textContent: '(0/0)' }
});

createElementAndAppend(articleElement, 'progress-bar', {
  props: { id: 'progress' },
  attrs: { current: '2', total: '5', color: 'red' } 
});

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

    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    const progress = this.shadowRoot.getElementById("progress");
    const score = this.shadowRoot.getElementById("score");
    const detail = this.shadowRoot.getElementById("score-detail");
    const categoryLabel = this.shadowRoot.querySelector(".category");
    const headerIcon = this.shadowRoot.querySelector(".header-icon");

    if (categoryLabel) {
        categoryLabel.textContent = category;
    }

    if (headerIcon) {
        if (icon.trim()) {
          headerIcon.textContent = icon;
          headerIcon.style.display = "inline-block";
        } else {
          headerIcon.style.display = "none";
        }
    }

    if (progress) {
        progress.setAttribute("current", current.toString());
        progress.setAttribute("total", total.toString());
        progress.setAttribute("color", color);
    }

    if (score) {
        score.textContent = `${percent}%`;
        score.style.color = scoreColor;
    }
    if (detail) {
        detail.textContent = `(${current}/${total})`;
    }
  }
}

customElements.define("results-progress-card", ResultsProgressCard);

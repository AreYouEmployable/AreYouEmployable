import { createElementAndAppend } from '../utils.js';

const template = document.createElement("template");

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/results-summary-card.css' }
});

const cardSection = createElementAndAppend(template.content, 'section', {
  classList: ['card']
});

const headerElement = createElementAndAppend(cardSection, 'header', {
  classList: ['title']
});

createElementAndAppend(headerElement, 'i', {
  classList: ['title-icon'],
  attrs: { 'aria-hidden': 'true' }
});

createElementAndAppend(headerElement, 'label', {
  classList: ['title-text']
});

createElementAndAppend(cardSection, 'ul', {
  props: { id: 'items-list' }
});

class ResultsSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.cardElement = this.shadowRoot.querySelector(".card");
    this.titleTextElement = this.shadowRoot.querySelector(".title-text");
    this.titleIconElement = this.shadowRoot.querySelector(".title-icon");
    this.titleContainerElement = this.shadowRoot.querySelector(".title"); 
    this.itemsListElement = this.shadowRoot.getElementById("items-list");
    this.hasRendered = false;
  }

  static get observedAttributes() {
    return ['items', 'title', 'background', 'title-color', 'item-color', 'title-icon', 'item-icon', 'icon-bg'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (this.isConnected) {
        this.render();
      }
    }
  }

  connectedCallback() {
    if (!this.hasRendered) {
        this.render();
        this.hasRendered = true;
    }
  }

  render() {
    const items = this.getAttribute("items")?.split("|") || [];
    const title = this.getAttribute("title") || "Summary";
    const background = this.getAttribute("background") || "#fffcf5";
    const titleColor = this.getAttribute("title-color") || "#384252";
    const itemColor = this.getAttribute("item-color") || "#384252";
    const titleIcon = this.getAttribute("title-icon") || "";
    const itemIcon = this.getAttribute("item-icon") || "";
    const iconBg = this.getAttribute("icon-bg") || "transparent";

    if (this.cardElement) {
        this.cardElement.style.backgroundColor = background;
    }
    if (this.titleContainerElement) {
        this.titleContainerElement.style.color = titleColor; 
    }
    if (this.titleTextElement) {
        this.titleTextElement.textContent = title;
        this.titleTextElement.style.color = titleColor; 
    }

    if (this.titleIconElement) {
        if (titleIcon.trim()) {
            this.titleIconElement.textContent = titleIcon;
            this.titleIconElement.style.backgroundColor = iconBg;
            this.titleIconElement.style.color = titleColor;
            this.titleIconElement.style.display = "inline-flex";
        } else {
            this.titleIconElement.style.display = "none";
        }
    }

    if (this.itemsListElement) {
        while (this.itemsListElement.firstChild) {
            this.itemsListElement.removeChild(this.itemsListElement.firstChild);
        }

        items.forEach((itemText) => {
            const li = createElementAndAppend(this.itemsListElement, "li");

            if (itemIcon.trim()) {
                createElementAndAppend(li, "i", {
                    props: { textContent: itemIcon },
                    classList: ["item-icon"],
                    style: {
                        backgroundColor: iconBg,
                        color: itemColor
                    }
                });
            }

            createElementAndAppend(li, "label", {
                props: { textContent: itemText.trim() },
                style: { color: itemColor }
            });
        });
    }
  }
}

customElements.define("results-summary-card", ResultsSummaryCard);

const template = document.createElement("template");

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/results-summary-card.css');
template.content.appendChild(stylesheetLink);

const cardSection = document.createElement('section');
cardSection.classList.add('card');

const headerElement = document.createElement('header');
headerElement.classList.add('title');

const titleIconElement = document.createElement('i');
titleIconElement.classList.add('title-icon');
titleIconElement.setAttribute('aria-hidden', 'true');
headerElement.appendChild(titleIconElement);

const titleTextLabel = document.createElement('label');
titleTextLabel.classList.add('title-text');
headerElement.appendChild(titleTextLabel);

cardSection.appendChild(headerElement);

const ulElement = document.createElement('ul');
ulElement.id = 'items-list';
cardSection.appendChild(ulElement);

template.content.appendChild(cardSection);

class ResultsSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.cardElement = this.shadowRoot.querySelector(".card");
    this.titleTextElement = this.shadowRoot.querySelector(".title-text");
    this.titleIconElement = this.shadowRoot.querySelector(".title-icon");
    this.titleDivElement = this.shadowRoot.querySelector(".title");
    this.itemsListElement = this.shadowRoot.getElementById("items-list");
  }

  static get observedAttributes() {
    return ['items', 'title', 'background', 'title-color', 'item-color', 'title-icon', 'item-icon', 'icon-bg'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
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
    if (this.titleDivElement) {
        this.titleDivElement.style.color = titleColor;
    }
    if (this.titleTextElement) {
        this.titleTextElement.textContent = title;
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
            const li = document.createElement("li");
            
            if (itemIcon.trim()) {
                const itemIconElement = document.createElement("i");
                itemIconElement.classList.add("item-icon");
                itemIconElement.style.backgroundColor = iconBg;
                itemIconElement.style.color = itemColor;
                itemIconElement.textContent = itemIcon;
                li.appendChild(itemIconElement);
            }
            
            const itemLabel = document.createElement("label");
            itemLabel.style.color = itemColor;
            itemLabel.textContent = itemText.trim();
            li.appendChild(itemLabel);
            
            this.itemsListElement.appendChild(li);
        });
    }
  }
}

customElements.define("results-summary-card", ResultsSummaryCard);

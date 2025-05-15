const template = document.createElement("template");

// Link stylesheet
const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/results-summary-card.css');
template.content.appendChild(stylesheetLink);

// Main card section
const cardSection = document.createElement('section');
cardSection.classList.add('card');

// Header element
const headerElement = document.createElement('header');
headerElement.classList.add('title');

// Title icon element
const titleIconElement = document.createElement('i');
titleIconElement.classList.add('title-icon');
titleIconElement.setAttribute('aria-hidden', 'true');
headerElement.appendChild(titleIconElement);

// Title text label
const titleTextLabel = document.createElement('label');
titleTextLabel.classList.add('title-text');
// titleTextLabel.textContent = ''; // Content will be set dynamically
headerElement.appendChild(titleTextLabel);

cardSection.appendChild(headerElement);

// Items list
const ulElement = document.createElement('ul');
ulElement.id = 'items-list';
// Comment indicating items will be injected
// ulElement.appendChild(document.createComment(' Items will be injected '));
cardSection.appendChild(ulElement);

template.content.appendChild(cardSection);

class ResultsSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const items = this.getAttribute("items")?.split("|") || [];
    const title = this.getAttribute("title") || "Summary";
    const background = this.getAttribute("background") || "#fffcf5"; // Default from original code
    const titleColor = this.getAttribute("title-color") || "#384252";
    const itemColor = this.getAttribute("item-color") || "#384252";
    const titleIcon = this.getAttribute("title-icon") || "";
    const itemIcon = this.getAttribute("item-icon") || "";
    const iconBg = this.getAttribute("icon-bg") || "transparent";

    // Set elements
    const card = this.shadowRoot.querySelector(".card");
    const titleSpan = this.shadowRoot.querySelector(".title-text");
    const titleIconSpan = this.shadowRoot.querySelector(".title-icon");
    const titleDiv = this.shadowRoot.querySelector(".title"); // This is the header element
    const list = this.shadowRoot.getElementById("items-list");

    // dynamic styles and content
    if (card) {
        card.style.backgroundColor = background;
    }
    if (titleDiv) {
        titleDiv.style.color = titleColor;
    }
    if (titleSpan) {
        titleSpan.textContent = title;
    }

    if (titleIconSpan) {
        if (titleIcon.trim()) {
            titleIconSpan.textContent = titleIcon;
            titleIconSpan.style.backgroundColor = iconBg; // This was applied to titleIconSpan
            titleIconSpan.style.color = titleColor; // Icon color should match title text color
            titleIconSpan.style.display = "inline-flex"; // Or 'flex' or 'block' depending on desired layout
        } else {
            titleIconSpan.style.display = "none";
        }
    }
    
    if (list) {
        list.innerHTML = ""; // Clear previous items

        items.forEach((itemText) => {
            const li = document.createElement("li");
            
            // Create icon element if itemIcon is present
            if (itemIcon.trim()) {
                const itemIconElement = document.createElement("i");
                itemIconElement.classList.add("item-icon"); // Add a class for potential styling
                itemIconElement.style.backgroundColor = iconBg;
                itemIconElement.style.color = itemColor; // Icon color
                itemIconElement.textContent = itemIcon;
                li.appendChild(itemIconElement);
            }
            
            const itemLabel = document.createElement("label");
            itemLabel.style.color = itemColor; 
            itemLabel.textContent = itemText.trim();
            li.appendChild(itemLabel);
            
            list.appendChild(li);
        });
    }
  }
}

customElements.define("results-summary-card", ResultsSummaryCard);

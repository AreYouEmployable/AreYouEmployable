const template = document.createElement("template");
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/results-summary-card.css">
  <section class="card">
    <header class="title">
        <i class="title-icon" aria-hidden="true"></i>
        <label class="title-text"></label>
    </header>
    <ul id="items-list">
        <!-- Items will be injected -->
    </ul>
  </section>
`;

class ResultsSummaryCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const items = this.getAttribute("items")?.split("|") || [];
    const title = this.getAttribute("title") || "Summary";
    const background = this.getAttribute("background") || "#fffcf5";
    const titleColor = this.getAttribute("title-color") || "#384252";
    const itemColor = this.getAttribute("item-color") || "#384252";
    const titleIcon = this.getAttribute("title-icon") || "";
    const itemIcon = this.getAttribute("item-icon") || "";
    const iconBg = this.getAttribute("icon-bg") || "transparent";

    // Set elements
    const card = this.shadowRoot.querySelector(".card");
    const titleSpan = this.shadowRoot.querySelector(".title-text");
    const titleIconSpan = this.shadowRoot.querySelector(".title-icon");
    const titleDiv = this.shadowRoot.querySelector(".title");
    const list = this.shadowRoot.getElementById("items-list");

    // dynamic styles and content
    card.style.backgroundColor = background;
    titleDiv.style.color = titleColor;
    titleIconSpan.textContent = titleIcon;
    titleIconSpan.style.backgroundColor = iconBg;
    titleIconSpan.style.color = itemColor;
    titleSpan.textContent = title;

    if (titleIcon.trim()) {
      titleIconSpan.textContent = titleIcon;
      titleIconSpan.style.backgroundColor = iconBg;
      titleIconSpan.style.color = titleColor;
      titleIconSpan.style.display = "inline-flex";
    } else {
      titleIconSpan.style.display = "none";
    }

    // Clear old items in case of re-render
    list.innerHTML = "";

    items.forEach((item) => {
      const li = document.createElement("li");
      const iconHTML = itemIcon.trim()
        ? `<i class="item-icon" style="background:${iconBg};color:${itemColor}">${itemIcon}</i>`
        : "";
      li.innerHTML = `
            ${iconHTML}
            <label style="color:${itemColor}">${item.trim()}</label>
        `;
      list.appendChild(li);
    });
  }
}

customElements.define("results-summary-card", ResultsSummaryCard);

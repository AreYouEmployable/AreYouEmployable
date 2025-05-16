
const barTemplate = document.createElement("template");
barTemplate.innerHTML = `
    <link rel="stylesheet" href="/styles/components/progress-bar.css">
    <progress id="bar" value="0" max="1"></progress>
  `;

class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(barTemplate.content.cloneNode(true));
    this.current = 0;
    this.total = 1;
  }

  static get observedAttributes() {
    return ["total", "current", "color"];
  }

  connectedCallback() {
    this.total = parseInt(this.getAttribute("total")) || 1;
    this.current = parseInt(this.getAttribute("current")) || 0;
    this.updateBar();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (["total", "current", "color"].includes(name)) {
      this[name] = name === "color" ? newVal : parseInt(newVal);
      this.updateBar();
    }
  }

  updateBar() {
    const bar = this.shadowRoot.getElementById("bar");
    const color = this.getAttribute("color") || "#2563eb";

    bar.value = this.current;
    bar.max = this.total;


    let style = this.shadowRoot.querySelector("style");
     if (!style) {
      style = document.createElement("style");
      this.shadowRoot.appendChild(style);
    }
    style.textContent = `
        progress {
          appearance: none;
          width: 100%;
          height: 0.8rem;
          border: none;
          border-radius: 0.4rem;
          background-color: #e5e7eb;
          overflow: hidden;
        }

        progress::-webkit-progress-bar {
          background-color: #e5e7eb;
          border-radius: 0.4rem;
        }

        progress::-webkit-progress-value {
          background-color: ${color};
          border-radius: 0.4rem;
          transition: width 0.3s ease;
        }

        progress::-moz-progress-bar {
          background-color: ${color};
          transition: width 0.3s ease;
        }
      `;
  }
}
if (!customElements.get("progress-bar")) {
customElements.define("progress-bar", ProgressBar);
}

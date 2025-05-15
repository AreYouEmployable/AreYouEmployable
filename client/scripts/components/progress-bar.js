
const barTemplate = document.createElement("template");
barTemplate.innerHTML = `
    <style>
      progress {
        appearance: none;
        width: 100%;
        height: 8px;
        border: none;
        border-radius: 4px;
        background-color: #e5e7eb;
        overflow: hidden;
      }

      progress::-webkit-progress-bar {
        background-color: #e5e7eb;
        border-radius: 4px;
      }

      progress::-webkit-progress-value {
        background-color: #2563eb;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      progress::-moz-progress-bar {
        background-color: #2563eb;
        transition: width 0.3s ease;
      }
    </style>
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

    const style = this.shadowRoot.querySelector("style");
    style.textContent = `
        progress {
          appearance: none;
          width: 100%;
          height: 8px;
          border: none;
          border-radius: 4px;
          background-color: #e5e7eb;
          overflow: hidden;
        }

        progress::-webkit-progress-bar {
          background-color: #e5e7eb;
          border-radius: 4px;
        }

        progress::-webkit-progress-value {
          background-color: ${color};
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        progress::-moz-progress-bar {
          background-color: ${color};
          transition: width 0.3s ease;
        }
      `;
  }
}

customElements.define("progress-bar", ProgressBar);
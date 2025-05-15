const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/progress-bar.css');
template.content.appendChild(stylesheetLink);

const progressContainerSection = document.createElement('section');
progressContainerSection.classList.add('progress-container');

const progressBarElement = document.createElement('progress');
progressBarElement.classList.add('progress-bar');
progressBarElement.id = 'bar';
progressBarElement.setAttribute('value', '0');
progressBarElement.setAttribute('max', '100');
progressContainerSection.appendChild(progressBarElement);

const progressTextSection = document.createElement('section');
progressTextSection.classList.add('progress-text');
progressTextSection.id = 'progress-text';
progressTextSection.textContent = '0%';
progressContainerSection.appendChild(progressTextSection);

template.content.appendChild(progressContainerSection);

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

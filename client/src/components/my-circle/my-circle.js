//EXAMPLE COMPONENT
class MyCircle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const [html, css] = await Promise.all([
            fetch('/src/components/my-circle/my-circle.html').then(res => res.text()),
            fetch('/src/components/my-circle/my-circle.css').then(res => res.text())
        ]);

        const style = document.createElement('style');
        style.textContent = css;

        const template = document.createElement('template');
        template.innerHTML = html;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.setupEventListeners();
    }

    setupEventListeners() {
        const circle = this.shadowRoot.querySelector('.circle');
        circle.addEventListener('click', () => {
            circle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
        });
    }
}

customElements.define('my-circle', MyCircle); 
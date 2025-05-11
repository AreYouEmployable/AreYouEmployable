export class ForbiddenPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="error-container">
                <h1>403 - Access Forbidden</h1>
                <p>Sorry, you don't have permission to access this page.</p>
                <a href="/" class="btn btn-primary">Return to Home</a>
            </div>
        `;
    }
}

customElements.define('forbidden-page', ForbiddenPage); 
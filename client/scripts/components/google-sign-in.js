// scripts/components/google-sign-in.js
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/google-sign-in.css">
  <section id="google-sign-in"></section>
`;

class GoogleSignIn extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.signInContainer = this.shadowRoot.getElementById('google-sign-in');
    }

    async connectedCallback() {
        await this.render();
        window.addEventListener('message', this.handleOAuthMessage.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('message', this.handleOAuthMessage.bind(this));
    }

    async render() {
        try {
            const user = await AuthService.getUserInfo();
            
            if (user && user.picture) {
                this.signInContainer.innerHTML = `
                    <section class="user-info" part="user-info">
                        <img src="${user.picture}" alt="${user.name}" class="user-avatar">
                        <button class="sign-out-button" id="sign-out">Sign Out</button>
                    </section>
                `;
                this.signInContainer.querySelector('#sign-out').addEventListener('click', async () => {
                    await AuthService.logout();
                    await this.render();
                });
            } else {
                this.signInContainer.innerHTML = `
                    <button class="sign-in-button" id="sign-in" part="sign-in-button">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon">
                        Sign in with Google
                    </button>
                `;
                this.signInContainer.querySelector('#sign-in').addEventListener('click', () => {
                    AuthService.signInWithGoogle();
                });
            }
        } catch (error) {
            console.error('Error rendering GoogleSignIn:', error);
        }
    }

    async handleOAuthMessage(event) {
        if (event.data.type === 'google-auth-callback') {
            await AuthService.handleAuthCallback(event.data.code);
            await this.render();
        }
    }
}

if (!customElements.get('google-sign-in')) {
    customElements.define('google-sign-in', GoogleSignIn);
}
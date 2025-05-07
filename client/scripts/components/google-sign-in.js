// scripts/components/google-sign-in.js
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="/styles/components/google-sign-in.css">
  <div id="google-sign-in"></div>
`;

class GoogleSignIn extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.signInContainer = this.shadowRoot.getElementById('google-sign-in');
    }

    connectedCallback() {
        this.render();
        window.addEventListener('message', this.handleOAuthMessage.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('message', this.handleOAuthMessage.bind(this));
    }

    render() {
        const user = AuthService.getUserInfo();
        if (user && user.picture) {
            this.signInContainer.innerHTML = `
                <div class="user-info">
                    <img src="${user.picture}" alt="${user.name}" class="user-avatar">
                    <button class="sign-out-button" id="sign-out">Sign Out</button>
                </div>
            `;
            this.signInContainer.querySelector('#sign-out').addEventListener('click', () => {
                AuthService.signOut();
                this.render();
            });
        } else {
            this.signInContainer.innerHTML = `
                <button class="sign-in-button" id="sign-in">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon">
                    Sign in with Google
                </button>
            `;
            this.signInContainer.querySelector('#sign-in').addEventListener('click', () => {
                AuthService.signInWithGoogle();
            });
        }
    }

    handleOAuthMessage(event) {
        if (event.data.type === 'google-auth-callback') {
            AuthService.handleAuthCallback(event.data.code);
            this.render();
        }
    }
}

customElements.define('google-sign-in', GoogleSignIn);
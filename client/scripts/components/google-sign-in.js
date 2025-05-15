import { createElementAndAppend } from '../utils.js';
import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

createElementAndAppend(template.content, 'link', {
  attrs: { rel: 'stylesheet', href: '/styles/components/google-sign-in.css' }
});

createElementAndAppend(template.content, 'section', {
  props: { id: 'google-sign-in' }
});

class GoogleSignIn extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.signInContainer = this.shadowRoot.getElementById('google-sign-in');
        this._boundHandleOAuthMessage = this.handleOAuthMessage.bind(this);
    }

    async connectedCallback() {
        await this.render();
        window.addEventListener('message', this._boundHandleOAuthMessage);
    }

    disconnectedCallback() {
        window.removeEventListener('message', this._boundHandleOAuthMessage);
    }

    async render() {
        if (!this.signInContainer) return;

        while (this.signInContainer.firstChild) {
            this.signInContainer.removeChild(this.signInContainer.firstChild);
        }

        try {
            const user = await AuthService.getUserInfo();

            if (user && user.picture) {
                const userInfoSection = createElementAndAppend(this.signInContainer, 'section', {
                  props: { className: 'user-info' },
                  attrs: { part: 'user-info' }
                });

                createElementAndAppend(userInfoSection, 'img', {
                  props: {
                    src: user.picture,
                    alt: user.name || 'User Avatar',
                    className: 'user-avatar'
                  }
                });

                createElementAndAppend(userInfoSection, 'button', {
                  props: {
                    className: 'sign-out-button',
                    id: 'sign-out',
                    textContent: 'Sign Out'
                  },
                  callbacks: {
                    click: async () => {
                        await AuthService.logout();
                        await this.render();
                    }
                  }
                });
            } else {
                const signInButton = createElementAndAppend(this.signInContainer, 'button', {
                  props: {
                    className: 'sign-in-button',
                    id: 'sign-in'
                  },
                  attrs: { part: 'sign-in-button' },
                  callbacks: {
                    click: () => {
                        AuthService.signInWithGoogle();
                    }
                  }
                });

                createElementAndAppend(signInButton, 'img', {
                  props: {
                    src: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                    alt: 'Google',
                    className: 'google-icon'
                  }
                });
                signInButton.appendChild(document.createTextNode(' Sign in with Google'));
            }
        } catch (error) {
            console.error('Error rendering GoogleSignIn:', error);
            createElementAndAppend(this.signInContainer, 'p', {
                props: { textContent: 'Error loading sign-in button.'},
                classList: ['error-message']
            });
        }
    }

    async handleOAuthMessage(event) {
        if (event && event.data && event.data.type === 'google-auth-callback' && typeof event.data.code === 'string') {
            try {
                await AuthService.handleAuthCallback(event.data.code);
                await this.render();
            } catch (error) {
                console.error('Error handling auth callback:', error);
            }
        } else if (event && event.data && event.data.type === 'google-auth-callback' && event.data.error) {
            console.error('OAuth Error:', event.data.error, event.data.error_description);
        }
    }
}

if (!customElements.get('google-sign-in')) {
    customElements.define('google-sign-in', GoogleSignIn);
}

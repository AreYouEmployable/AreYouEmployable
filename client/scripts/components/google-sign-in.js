import { AuthService } from '../services/auth.js';

const template = document.createElement('template');

const stylesheetLink = document.createElement('link');
stylesheetLink.setAttribute('rel', 'stylesheet');
stylesheetLink.setAttribute('href', '/styles/components/google-sign-in.css');
template.content.appendChild(stylesheetLink);

const sectionElement = document.createElement('section');
sectionElement.id = 'google-sign-in';
template.content.appendChild(sectionElement);

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
                const userInfoSection = document.createElement('section');
                userInfoSection.className = 'user-info';
                userInfoSection.setAttribute('part', 'user-info');

                const userAvatarImg = document.createElement('img');
                userAvatarImg.src = user.picture;
                userAvatarImg.alt = user.name || 'User Avatar';
                userAvatarImg.className = 'user-avatar';
                userInfoSection.appendChild(userAvatarImg);

                const signOutButton = document.createElement('button');
                signOutButton.className = 'sign-out-button';
                signOutButton.id = 'sign-out';
                signOutButton.textContent = 'Sign Out';
                signOutButton.addEventListener('click', async () => {
                    await AuthService.logout();
                    await this.render();
                });
                userInfoSection.appendChild(signOutButton);
                this.signInContainer.appendChild(userInfoSection);

            } else {
                const signInButton = document.createElement('button');
                signInButton.className = 'sign-in-button';
                signInButton.id = 'sign-in';
                signInButton.setAttribute('part', 'sign-in-button');

                const googleIconImg = document.createElement('img');
                googleIconImg.src = 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg';
                googleIconImg.alt = 'Google';
                googleIconImg.className = 'google-icon';
                signInButton.appendChild(googleIconImg);

                signInButton.appendChild(document.createTextNode(' Sign in with Google'));
                signInButton.addEventListener('click', () => {
                    AuthService.signInWithGoogle();
                });
                this.signInContainer.appendChild(signInButton);
            }
        } catch (error) {
            console.error('Error rendering GoogleSignIn:', error);
            const errorTextNode = document.createTextNode('Error loading sign-in button.');
            this.signInContainer.appendChild(errorTextNode);
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

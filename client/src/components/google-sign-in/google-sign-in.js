import { AuthService } from '../../services/auth.js';

class GoogleSignIn extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');
        this.template.innerHTML = `
            <style>
                .sign-in-button {
                    background-color: #fff;
                    color: #757575;
                    border: 1px solid #dadce0;
                    border-radius: .4rem;
                    padding: .5rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: .5rem;
                    cursor: pointer;
                    font-size: .8rem;
                    transition: background-color 0.3s ease;
                }

                .sign-in-button:hover {
                    background-color: #f8f9fa;
                }

                .google-icon {
                    width: 1.1rem;
                    height: 1.1rem;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: .5rem;
                }

                .user-avatar {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                }

                .sign-out-button {
                    background-color: transparent;
                    color: white;
                    border: 1px solid white;
                    border-radius: .4rem;
                    padding: .4rem .5rem;
                    cursor: pointer;
                    font-size: .6rem;
                    transition: background-color 0.3s ease;
                }

                .sign-out-button:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            </style>
            <section id="container">
                <button class="sign-in-button" id="signInButton">
                    <img class="google-icon" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google">
                    Sign in with Google
                </button>
                <section class="user-info" id="userInfo" style="display: none;">
                    <img class="user-avatar" id="userAvatar" alt="User avatar">
                    <p id="userName"></p>
                    <button class="sign-out-button" id="signOutButton">Sign Out</button>
                </section>
            </section>
        `;
    }

    connectedCallback() {
        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        const signInButton = this.shadowRoot.getElementById('signInButton');
        const signOutButton = this.shadowRoot.getElementById('signOutButton');

        signInButton.addEventListener('click', () => {
            this.initiateGoogleSignIn();
        });

        signOutButton.addEventListener('click', () => {
            AuthService.logout();
        });
    }

    async checkAuthState() {
        const isAuthenticated = AuthService.isAuthenticated();
        const signInButton = this.shadowRoot.getElementById('signInButton');
        const userInfo = this.shadowRoot.getElementById('userInfo');

        if (isAuthenticated) {
            try {
                const userData = await AuthService.getUserInfo();
                if (userData) {
                    signInButton.style.display = 'none';
                    userInfo.style.display = 'flex';
                    this.shadowRoot.getElementById('userAvatar').src = userData.picture;
                    this.shadowRoot.getElementById('userName').textContent = userData.name;
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        } else {
            signInButton.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    }

    async initiateGoogleSignIn() {
        try {
            await AuthService.signInWithGoogle();
            this.checkAuthState();
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    }
}

customElements.define('google-sign-in', GoogleSignIn); 
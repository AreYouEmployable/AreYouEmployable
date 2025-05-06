import { AuthService } from '../services/auth.js';
import { Helpers } from '../utils/helpers.js';

import '../components/my-circle/my-circle.js';
import '../components/google-sign-in/google-sign-in.js';

class HomePage {
    constructor() {
        this.state = {
            user: null,
            isLoading: true
        };
        this.init();
    }

    async init() {
        await this.setupUI();
        this.setupEventListeners();
        this.setupAuthStateListener();
        this.setupRouteListener();
    }

    async setupUI() {
        const isAuthenticated = AuthService.isAuthenticated();
        const header = document.querySelector('main h1');
        
        if (isAuthenticated) {
            try {
                const userInfo = await AuthService.getUserInfo();
                if (userInfo) {
                    this.state.user = userInfo;
                    header.textContent = `Welcome, ${userInfo.name}!`;
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
                header.textContent = 'Welcome to My Web App';
            }
        } else {
            header.textContent = 'Welcome to My Web App';
        }
    }

    setupEventListeners() {
        const circle = document.querySelector('my-circle');
        if (circle) {
            const debouncedClick = Helpers.debounce(() => {
                console.log('Circle clicked!');
            }, 300);
            
            circle.addEventListener('click', debouncedClick);
        }
    }

    setupAuthStateListener() {
        document.addEventListener('authStateChanged', async (event) => {
            const { isAuthenticated } = event.detail;
            await this.setupUI();
        });
    }

    setupRouteListener() {
        window.addEventListener('routeChange', (event) => {
            const { route } = event.detail;
            if (route === 'profile' && !AuthService.isAuthenticated()) {
                window.location.href = '/';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
}); 
import { config } from '../config.js';

export class AuthService {
    static getToken() {
        return localStorage.getItem('google_id_token');
    }

    static setToken(token) {
        localStorage.setItem('google_id_token', token);
    }

    static clearToken() {
        localStorage.removeItem('google_id_token');
    }

    static async signInWithGoogle() {
        const clientId = config.GOOGLE_CLIENT_ID;
        const redirectUri = `${config.API_URL}/api/auth/google/callback`;
        const scope = 'openid email profile';
        
        // Generate a random state for CSRF protection
        const state = crypto.randomUUID();
        localStorage.setItem('oauth_state', state);
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=code&` + 
            `scope=${encodeURIComponent(scope)}&` +
            `access_type=offline&` +
            `prompt=consent&` +
            `state=${encodeURIComponent(state)}`;
        
        window.location.href = authUrl;
    }

    static async handleOAuthCallback() {
        const params = new URLSearchParams(window.location.search);
        const googleIdToken = params.get('google_id_token');
        const error = params.get('error');
        const state = params.get('state');

        // Verify state to prevent CSRF attacks
        const savedState = localStorage.getItem('oauth_state');
        localStorage.removeItem('oauth_state');

        if (savedState !== state) {
            console.error('State mismatch - possible CSRF attack');
            throw new Error('invalid_state');
        }

        if (error) {
            console.error('Auth error:', error);
            throw new Error(error);
        }

        if (googleIdToken) {
            this.setToken(googleIdToken);
            const user = await this.getUserInfo();
            return user;
        }

        return null;
    }

    static async getUserInfo() {
        const token = this.getToken();
        if (!token) {
            return null;
        }

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const userInfo = JSON.parse(jsonPayload);
            const user = {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture
            };
            
            return user;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }

    static async logout() {
        try {
            this.clearToken();
            
            localStorage.removeItem('oauth_state');
            
            window.location.href = '/';
            
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }
}
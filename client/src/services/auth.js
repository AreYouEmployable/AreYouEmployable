export class AuthService {
    static getToken() {
        return localStorage.getItem('jwt');
    }

    static setToken(token) {
        localStorage.setItem('jwt', token);
    }

    static removeToken() {
        localStorage.removeItem('jwt');
    }

    static async signInWithGoogle() {
        const clientId = process.env.GOOGLE_ID;
        const redirectUri = `${window.location.origin}/oauth2callback.html`;
        const scope = 'email profile';
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=token&` +
            `scope=${encodeURIComponent(scope)}`;

        window.location.href = authUrl;
    }

    static async getUserInfo() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user info');
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    }

    static async isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    static async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            });
            this.removeToken();
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
} 
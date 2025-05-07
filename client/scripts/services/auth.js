import { config } from '../config.js';

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
      const clientId = config.GOOGLE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/oauth2callback.html`;
      const scope = 'email profile';
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` + 
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      // Open in popup or redirect
      const width = 500;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        authUrl,
        'google_auth',
        `width=${width},height=${height},top=${top},left=${left}`
      );
    }
  
    static async handleOAuthCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      if (code) {
        await this.handleAuthCallback(code);
        return true;
      }
      return false;
    }
  
    static async handleAuthCallback(code) {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        
        if (!response.ok) throw new Error('Auth failed');
        
        const { token, user } = await response.json();
        this.setToken(token);
        return user;
      } catch (error) {
        console.error('Google auth error:', error);
        throw error;
      }
    }
  
    static async getUserInfo() {
      const token = this.getToken();
      if (!token) return null;
  
      try {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (!response.ok) throw new Error('Failed to fetch user info');
        
        const { user } = await response.json();
        return user;
      } catch (error) {
        console.error('Error fetching user info:', error);
        this.removeToken();
        return null;
      }
    }
  
    static async isAuthenticated() {
      const token = this.getToken();
      if (!token) return false;
  
      try {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
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
          headers: { 'Authorization': `Bearer ${this.getToken()}` }
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.removeToken();
        window.location.href = '/';
      }
    }
  }
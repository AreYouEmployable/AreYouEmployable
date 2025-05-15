import { config } from '../config.js';
import { AuthService } from './auth.js';

const API_BASE_URL = config.API_URL;
export class ApiService {
    
    static async request(endpoint, options = {}) {
        const token = AuthService.getToken();
        if (!token) {
            window.location.href = '/forbidden';
            throw new Error('Not authenticated');
        }

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...defaultOptions,
                ...options,
                headers: {
                    ...defaultOptions.headers,
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (errorData.error === 'token_expired' || response.status === 401) {
                    AuthService.clearToken();
                    window.location.href = '/forbidden';
                    throw new Error('Token expired');
                }
                
                if (response.status === 403) {
                    window.location.href = '/forbidden';
                    throw new Error('forbidden');
                }

                throw new Error(errorData.message || `API request failed: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    static async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
} 
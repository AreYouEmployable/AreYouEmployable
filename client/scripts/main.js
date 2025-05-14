import { store, actions } from './state.js';
import { AuthService } from './services/auth.js';
import { router } from './router.js';
import './components/google-sign-in.js';
import './components/error-page.js';
import './components/forbidden-page.js';

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const googleIdToken = params.get('google_id_token');
    const error = params.get('error');

    if (error) {
        console.error('Auth error:', error);
        if (error === 'forbidden_error') {
            // Clear any existing auth state
            store.dispatch(actions.clearAuth());
            document.body.innerHTML = '<error-page></error-page>';
            return;
        }
        store.dispatch(actions.setAuthError('Authentication failed'));
    } else if (googleIdToken) {
        AuthService.setToken(googleIdToken);
        const user = await AuthService.getUserInfo();
        store.dispatch(actions.setAuth({
            isAuthenticated: true,
            user,
            token: googleIdToken
        }));
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (AuthService.getToken()) {
        const user = await AuthService.getUserInfo();
        store.dispatch(actions.setAuth({
            isAuthenticated: true,
            user,
            token: AuthService.getToken()
        }));
    }

    // Initialize router
    router.handleRouting();

    document.addEventListener('start-assessment', () => {
        router.navigateTo('/assessment');
    });
});
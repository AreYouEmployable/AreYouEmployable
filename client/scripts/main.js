import { store, actions } from './state.js';
import { AuthService } from './services/auth.js';
import './components/google-sign-in.js';

document.addEventListener('DOMContentLoaded', async () => {
    const isCallbackHandled = await AuthService.handleOAuthCallback();
    
    if (isCallbackHandled || AuthService.getToken()) {
        const user = await AuthService.getUserInfo();
        store.dispatch(actions.setAuth({
            user,
            token: AuthService.getToken()
        }));
    }
    document.addEventListener('start-assessment', () => {
        router.navigateTo('/assessment');
      });
});
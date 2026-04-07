import { ACCESS_TOKEN_KEY } from './constants';

class AuthContext {
	accessToken = $state(localStorage.getItem(ACCESS_TOKEN_KEY));
	isAuthenticated = $derived(!!this.accessToken);

	setAccessToken(accessToken: string) {
		this.accessToken = accessToken;
		localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	}

	clearAccessToken() {
		this.accessToken = null;
		localStorage.removeItem(ACCESS_TOKEN_KEY);
	}
}

export const authContext = new AuthContext();

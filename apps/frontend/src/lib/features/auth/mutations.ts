import { createMutation } from '@tanstack/svelte-query';

import { login, logout, register } from './api';
import { authContext } from './store.svelte';

export function createLoginMutation() {
	return createMutation(() => ({
		mutationFn: login,
		onSuccess: (data) => authContext.setAccessToken(data.accessToken),
	}));
}

export function createRegisterMutation() {
	return createMutation(() => ({
		mutationFn: register,
		onSuccess: (data) => authContext.setAccessToken(data.accessToken),
	}));
}

export function createLogoutMutation() {
	return createMutation(() => ({
		mutationFn: logout,
		onSettled: () => authContext.clearAccessToken(),
	}));
}

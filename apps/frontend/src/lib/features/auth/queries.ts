import { createQuery } from '@tanstack/svelte-query';

import { getMe } from './api';
import { authContext } from './store.svelte';

export function createGetMeQuery() {
	return createQuery(() => ({
		queryKey: ['me'],
		queryFn: getMe,
		enabled: authContext.isAuthenticated,
	}));
}

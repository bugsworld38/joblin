import { apiClient } from '$lib/shared/api';

import type {
	LoginRequest,
	LoginResponse,
	MeResponse,
	RegisterRequest,
	RegisterResponse,
} from './types';

export async function login(data: LoginRequest): Promise<LoginResponse> {
	const response = await apiClient.post<LoginResponse>('/auth/login', data);

	return response.data;
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
	const response = await apiClient.post('/auth/register', data);

	return response.data;
}

export async function logout(): Promise<void> {
	await apiClient.post('/auth/logout');
}

export async function getMe(): Promise<MeResponse> {
	const response = await apiClient.get('/auth/me');

	return response.data;
}

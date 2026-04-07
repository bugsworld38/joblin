export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	accessToken: string;
}

export interface MeResponse {
	id: string;
	email: string;
}

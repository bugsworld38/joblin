import { toast } from 'svelte-sonner';
import { superForm } from 'sveltekit-superforms';
import { zod4Client } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { parseErrorMessage } from '$lib/shared/utils';

import { createLoginMutation } from '../mutations';
import type { LoginRequest } from '../types';

const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export const useLogin = () => {
	const loginMutation = createLoginMutation();

	const form = superForm(
		{ email: '', password: '' },
		{
			SPA: true,
			validators: zod4Client(loginSchema),
			onUpdate: ({ form: f }) => {
				if (f.valid) {
					handleSubmit(f.data);
				}
			},
		},
	);

	const handleSubmit = async (data: LoginRequest) => {
		try {
			await loginMutation.mutateAsync(data);
		} catch (error) {
			toast.error(parseErrorMessage(error));
		}
	};

	return { form };
};

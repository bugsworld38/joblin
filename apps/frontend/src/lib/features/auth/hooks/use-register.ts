import { toast } from 'svelte-sonner';
import { superForm } from 'sveltekit-superforms';
import { zod4Client } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { parseErrorMessage } from '$lib/shared/utils';

import { createRegisterMutation } from '../mutations';
import type { RegisterRequest } from '../types';

const registerSchema = z
	.object({
		email: z.email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const useRegister = () => {
	const registerMutation = createRegisterMutation();

	const form = superForm(
		{ email: '', password: '', confirmPassword: '' },
		{
			SPA: true,
			validators: zod4Client(registerSchema),
			onUpdate: ({ form: f }) => {
				if (f.valid) {
					handleSubmit(f.data);
				}
			},
		},
	);

	const handleSubmit = async (data: RegisterRequest) => {
		try {
			const { accessToken } = await registerMutation.mutateAsync({
				email: data.email,
				password: data.password,
			});
			toast.success(accessToken);
		} catch (error) {
			toast.error(parseErrorMessage(error));
		}
	};

	return { form };
};

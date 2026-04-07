import { z } from 'zod';

const serverErrorSchema = z.object({
	response: z.object({
		data: z.object({
			message: z.string(),
			error: z.string(),
			statusCode: z.number(),
		}),
		status: z.number(),
	}),
});

function parseErrorMessage(error: unknown, fallback = 'Something went wrong') {
	const parsedError = serverErrorSchema.safeParse(error);

	if (parsedError.success) {
		return parsedError.data.response.data.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallback;
}

export { parseErrorMessage };

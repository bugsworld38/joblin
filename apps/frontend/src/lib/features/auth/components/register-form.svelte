<script lang="ts">
	import * as Form from '$lib/shared/components/form';
	import { Input } from '$lib/shared/components/input';

	import { useRegister } from '../hooks';

	const { form } = useRegister();

	const { form: formData, enhance } = form;
</script>

<form class="space-y-10" use:enhance>
	<div class="space-y-6">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>E-mail</Form.Label>
					<Input
						{...props}
						bind:value={$formData.email}
						autocomplete="email"
						placeholder="example@email.com"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<Input
						{...props}
						bind:value={$formData.password}
						type="password"
						autocomplete="new-password"
						placeholder="•••••••••••"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<Input
						{...props}
						bind:value={$formData.confirmPassword}
						type="password"
						autocomplete="new-password"
						placeholder="•••••••••••"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Button class="w-full" size="lg">Continue</Form.Button>
</form>

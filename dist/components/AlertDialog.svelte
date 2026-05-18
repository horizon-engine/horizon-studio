<script lang="ts">
	import { alertStore, type AlertOptions } from '../stores/alertStore.svelte';
	import Button from './Button.svelte';

	let dialog = $derived<AlertOptions | null>(alertStore.current);

	function handleCancel(): void {
		if (dialog?.onCancel) dialog.onCancel();
		alertStore.close();
	}

	function handleContinue(): void {
		if (dialog?.onContinue) dialog.onContinue();
		alertStore.close();
	}
</script>

{#if dialog}
	<div class="fixed inset-0 z-[1200] flex items-center justify-center bg-overlay backdrop-blur-sm">
		<div class="mx-4 w-full max-w-md rounded-lg bg-background p-6 shadow-xl">
			{#if dialog.title}
				<h2 class="mb-4 text-xl font-semibold text-text-primary">
					{dialog.title}
				</h2>
			{/if}
			{#if dialog.body}
				<p class="mb-6 text-text-secondary">
					{dialog.body}
				</p>
			{/if}
			<div class="flex justify-end gap-3">
				<Button variant="secondary" onclick={handleCancel}>
					{dialog.cancelText || 'Cancel'}
				</Button>
				<Button variant="primary" onclick={handleContinue}>
					{dialog.continueText || 'Continue'}
				</Button>
			</div>
		</div>
	</div>
{/if}

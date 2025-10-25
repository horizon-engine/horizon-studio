<script lang="ts">
	import { alertStore, type AlertOptions } from '$lib/stores/alertStore.svelte';

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
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm">
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
				<button
					onclick={handleCancel}
					class="rounded bg-surface px-4 py-2 text-text-primary transition-colors hover:bg-border-strong"
				>
					{dialog.cancelText || 'Cancel'}
				</button>
				<button
					onclick={handleContinue}
					class="rounded bg-primary px-4 py-2 text-text-inverted transition-colors hover:bg-primary-dark"
				>
					{dialog.continueText || 'Continue'}
				</button>
			</div>
		</div>
	</div>
{/if}

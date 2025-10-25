<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Toaster, type ToastOptions } from 'svelte-5-french-toast';
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import DnDProvider from '$lib/providers/DnDProvider.svelte';
	import AlertDialog from '$lib/components/AlertDialog.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	const toastOptions: ToastOptions = {
		style: 'background: var(--color-surface); color: var(--color-text-primary);'
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Toaster {toastOptions} />
<SvelteFlowProvider>
	<DnDProvider>
		{@render children?.()}
	</DnDProvider>
</SvelteFlowProvider>
<AlertDialog />

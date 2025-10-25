<script lang="ts">
	import * as floatingPanel from '@zag-js/floating-panel';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { type Snippet } from 'svelte';
	import X from 'virtual:icons/lucide/x';

	interface Props {
		id: string;
		title: string;
		open: boolean;
		children?: Snippet;
		position: { x: number; y: number };
		[key: string]: any;
	}

	let { id, title, open = $bindable(), children, position, ...restProps }: Props = $props();

	const service = useMachine(floatingPanel.machine, {
		id,
		resizable: false,
		defaultSize: { width: 250, height: 400 },
		getAnchorPosition() {
			return {
				x: position.x - 125,
				y: position.y - 140
			};
		}
	});

	const api = $derived(floatingPanel.connect(service, normalizeProps));

	$effect(() => {
		api.setOpen(open);
	});
</script>

<div {...api.getPositionerProps()} {...restProps}>
	<div
		{...api.getContentProps()}
		class="flex flex-col overflow-hidden rounded-lg border border-border-medium bg-background shadow-2xl"
	>
		<div
			{...api.getDragTriggerProps()}
			style={api.dragging ? 'cursor: grabbing !important;' : 'cursor: grab !important;'}
		>
			<div
				{...api.getHeaderProps()}
				class="flex items-center justify-between border-b border-border-medium bg-surface px-2 py-1"
			>
				<p {...api.getTitleProps()} class="text-sm font-semibold text-text-primary select-none">
					{title}
				</p>
				<div {...api.getControlProps()} class="flex items-center gap-1">
					<button
						class="rounded p-1.5 text-text-secondary transition-colors hover:bg-error-muted hover:text-error"
						aria-label="Close"
						onclick={() => (open = false)}
					>
						<X />
					</button>
				</div>
			</div>
		</div>
		<div class="flex-1 overflow-auto bg-background">
			{@render children?.()}
		</div>
	</div>
</div>

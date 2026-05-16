<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import { getNodeTitle } from '../../node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

{#snippet while_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="color: #3c61aa">
		<path d="M3 12a9 9 0 1 0 9-9a9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></g>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('while_node')}
	color="#252F52"
	text_color="#3c61aa"
	{enabled}
	{error_message}
	{selected}
	icon={while_icon}
	handles={[
		{
			id: 'while_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: 'none'
		},
		{
			id: 'while_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: 'bool'
		},
		{
			id: 'while_node_source_1',
			type: 'source',
			y_position_percents: 30,
			valid_types: 'none'
		},
		{
			id: 'while_node_source_2',
			type: 'source',
			y_position_percents: 70,
			valid_types: 'none'
		}
	]}
>
	<div class="space-y-3">
		<div class="my-0.5 flex flex-col justify-between space-y-2">
			<div class="flex flex-1 justify-between gap-10 text-right">
				<div class="text-xs text-text-muted">►</div>
				<div class="text-xs text-text-muted">while true</div>
			</div>
			<div class="flex flex-1 justify-between gap-10 text-right">
				<div class="text-xs text-text-muted">condition (bool)</div>
				<div class="text-xs text-text-muted">when finished</div>
			</div>
		</div>
	</div>
</Node>

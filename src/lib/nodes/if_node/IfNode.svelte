<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import { getNodeTitle } from '$lib/node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('if_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'if_node_target_1',
			type: 'target',
			y_position_percents: 22,
			valid_types: 'none'
		},
		{
			id: 'if_node_target_2',
			type: 'target',
			y_position_percents: 78,
			valid_types: 'bool'
		},
		{
			id: 'if_node_source_1',
			type: 'source',
			y_position_percents: 22,
			valid_types: 'none'
		},
		{
			id: 'if_node_source_2',
			type: 'source',
			y_position_percents: 50,
			valid_types: 'none'
		},
		{
			id: 'if_node_source_3',
			type: 'source',
			y_position_percents: 78,
			valid_types: 'none'
		}
	]}
>
	<div class="space-y-3">
		<div class="my-0.5 flex flex-col justify-between space-y-2">
			<div class="flex flex-1 justify-between gap-10 text-right">
				<div class="text-xs text-text-muted">►</div>
				<div class="text-xs text-text-muted">if true</div>
			</div>
			<div class="flex flex-1 flex-row-reverse justify-between gap-10 text-right">
				<div class="text-xs text-text-muted">if false</div>
			</div>
			<div class="flex flex-1 justify-between gap-10 text-right">
				<div class="text-xs text-text-muted">condition (bool)</div>
				<div class="text-xs text-text-muted">when finished</div>
			</div>
		</div>
	</div>
</Node>

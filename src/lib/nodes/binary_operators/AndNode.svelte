<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import { getNodeShortDescription, getNodeTitle } from '$lib/node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('and_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'and_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: 'bool'
		},
		{
			id: 'and_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: 'bool'
		},
		{
			id: 'and_node_source_1',
			type: 'source',
			valid_types: 'bool'
		}
	]}
>
	<div class="my-1 space-y-3">
		<div class="flex flex-col justify-between space-y-3">
			<div class="flex-1 text-right">
				<div class="text-xs text-text-muted">{getNodeShortDescription('and_node')}</div>
			</div>
		</div>
	</div>
</Node>

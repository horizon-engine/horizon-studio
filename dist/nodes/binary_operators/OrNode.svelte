<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { getNodeTitle } from '../../node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('or_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'or_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: 'bool'
		},
		{
			id: 'or_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: 'bool'
		},
		{
			id: 'or_node_source_1',
			type: 'source',
			valid_types: 'bool'
		}
	]}
>
	<NodeDescription nodeType='or_node' />
</Node>

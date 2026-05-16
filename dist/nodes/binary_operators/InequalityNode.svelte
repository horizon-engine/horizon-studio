<script lang="ts">
	import type { NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { coerce_types } from '../../type_utils';
	import { getNodeTitle } from '../../node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('inequality_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'inequality_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: 'any',
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'inequality_node_target_2',
					coerce_types(node_handle_types.get('inequality_node_target_2')!, valid_types)!
				);
			}
		},
		{
			id: 'inequality_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: 'any',
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'inequality_node_target_1',
					coerce_types(node_handle_types.get('inequality_node_target_1')!, valid_types)!
				);
			}
		},
		{
			id: 'inequality_node_source_1',
			type: 'source',
			valid_types: 'bool'
		}
	]}
>
	<NodeDescription nodeType='inequality_node' />
</Node>

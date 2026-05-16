<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { coerce_types } from '../../type_utils';
	import { getNodeTitle } from '../../node_metadata';
	import { type HandleType } from '../../types';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('divide_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'divide_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'divide_node_target_2',
					coerce_types(node_handle_types.get('divide_node_target_2')!, valid_types)!
				);
				node_handle_types.set(
					'divide_node_source_1',
					coerce_types(node_handle_types.get('divide_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'divide_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'divide_node_target_1',
					coerce_types(node_handle_types.get('divide_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'divide_node_source_1',
					coerce_types(node_handle_types.get('divide_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'divide_node_source_1',
			type: 'source',
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'divide_node_target_1',
					coerce_types(node_handle_types.get('divide_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'divide_node_target_2',
					coerce_types(node_handle_types.get('divide_node_target_2')!, valid_types)!
				);
			}
		}
	]}
>
	<NodeDescription nodeType='divide_node' />
</Node>

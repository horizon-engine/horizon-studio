<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { coerce_types } from '../../type_utils';
	import { getNodeTitle } from '../../node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>


{#snippet multiply_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="color: #FB923C">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('multiply_node')}
	color="#3A2A1E"
	text_color="#FB923C"
	{enabled}
	{error_message}
	{selected}
	icon={multiply_icon}
	handles={[
		{
			id: 'multiply_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'multiply_node_target_2',
					coerce_types(node_handle_types.get('multiply_node_target_2')!, valid_types)!
				);
				node_handle_types.set(
					'multiply_node_source_1',
					coerce_types(node_handle_types.get('multiply_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'multiply_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'multiply_node_target_1',
					coerce_types(node_handle_types.get('multiply_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'multiply_node_source_1',
					coerce_types(node_handle_types.get('multiply_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'multiply_node_source_1',
			type: 'source',
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'multiply_node_target_1',
					coerce_types(node_handle_types.get('multiply_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'multiply_node_target_2',
					coerce_types(node_handle_types.get('multiply_node_target_2')!, valid_types)!
				);
			}
		}
	]}
>
	<NodeDescription nodeType='multiply_node' />
</Node>

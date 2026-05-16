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

<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/></svg> -->

{#snippet subtract_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="color: #F472B6">
		 <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"/>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('subtract_node')}
	color="#3F1F2A"
	text_color="#F472B6"
	{enabled}
	{error_message}
	{selected}
	icon={subtract_icon}
	handles={[
		{
			id: 'subtract_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'subtract_node_target_2',
					coerce_types(node_handle_types.get('subtract_node_target_2')!, valid_types)!
				);
				node_handle_types.set(
					'subtract_node_source_1',
					coerce_types(node_handle_types.get('subtract_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'subtract_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'subtract_node_target_1',
					coerce_types(node_handle_types.get('subtract_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'subtract_node_source_1',
					coerce_types(node_handle_types.get('subtract_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'subtract_node_source_1',
			type: 'source',
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'subtract_node_target_1',
					coerce_types(node_handle_types.get('subtract_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'subtract_node_target_2',
					coerce_types(node_handle_types.get('subtract_node_target_2')!, valid_types)!
				);
			}
		}
	]}
>
	<NodeDescription nodeType='subtract_node' />
</Node>

<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { coerce_types } from '$lib/type_utils';
	import { getNodeTitle } from '$lib/node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

<!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></g></svg> -->

{#snippet modulo_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="color: #94A3B8">
		<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></g>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('modulo_node')}
	color="#2A3442"
	text_color="#94A3B8"
	{enabled}
	{error_message}
	{selected}
	icon={modulo_icon}
	handles={[
		{
			id: 'modulo_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'modulo_node_target_2',
					coerce_types(node_handle_types.get('modulo_node_target_2')!, valid_types)!
				);
				node_handle_types.set(
					'modulo_node_source_1',
					coerce_types(node_handle_types.get('modulo_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'modulo_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'modulo_node_target_1',
					coerce_types(node_handle_types.get('modulo_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'modulo_node_source_1',
					coerce_types(node_handle_types.get('modulo_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'modulo_node_source_1',
			type: 'source',
			valid_types: {
				or: ['int', 'float']
			},
			onconnect: (valid_types, node_handle_types) => {
				node_handle_types.set(
					'modulo_node_target_1',
					coerce_types(node_handle_types.get('modulo_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'modulo_node_target_2',
					coerce_types(node_handle_types.get('modulo_node_target_2')!, valid_types)!
				);
			}
		}
	]}
>
	<NodeDescription nodeType='modulo_node' />
</Node>

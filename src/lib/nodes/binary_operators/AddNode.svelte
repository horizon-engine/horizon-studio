<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import { coerce_types } from '$lib/type_utils';
	import { getNodeShortDescription, getNodeTitle } from '$lib/node_metadata';
	import type { HandleType } from '$lib/types';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

{#snippet add_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="color: #C084FC">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/>
	</svg>
{/snippet}


<Node
	{id}
	title={getNodeTitle('add_node')}
	color="#2E1F47"
	text_color="#C084FC"
	{enabled}
	{error_message}
	{selected}
	icon={add_icon}
	handles={[
		{
			id: 'add_node_target_1',
			type: 'target',
			y_position_percents: 30,
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'add_node_target_2',
					coerce_types(node_handle_types.get('add_node_target_2')!, valid_types)!
				);
				node_handle_types.set(
					'add_node_source_1',
					coerce_types(node_handle_types.get('add_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'add_node_target_2',
			type: 'target',
			y_position_percents: 70,
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'add_node_target_1',
					coerce_types(node_handle_types.get('add_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'add_node_source_1',
					coerce_types(node_handle_types.get('add_node_source_1')!, valid_types)!
				);
			}
		},
		{
			id: 'add_node_source_1',
			type: 'source',
			valid_types: { or: ['int', 'float'] },
			onconnect: (
				valid_types: HandleType | null,
				node_handle_types: Map<string, HandleType | null>
			) => {
				node_handle_types.set(
					'add_node_target_1',
					coerce_types(node_handle_types.get('add_node_target_1')!, valid_types)!
				);
				node_handle_types.set(
					'add_node_target_2',
					coerce_types(node_handle_types.get('add_node_target_2')!, valid_types)!
				);
			}
		}
	]}
>
	<div class="my-1 space-y-3">
		<div class="flex flex-col justify-between space-y-3">
			<div class="flex-1 text-right">
				<div class="text-xs text-text-muted">{getNodeShortDescription('add_node')}</div>
			</div>
		</div>
	</div>
</Node>

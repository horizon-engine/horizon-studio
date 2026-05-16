<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { getNodeTitle } from '../../node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

{#snippet and_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h3m-1.5 0a8 8 0 0 1-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13"/>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('and_node')}
	color="#2A2A2A"
	text_color="#F5F5F5"
	{enabled}
	{error_message}
	{selected}
	icon={and_icon}
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
	<NodeDescription nodeType='and_node' />
</Node>

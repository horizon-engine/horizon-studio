<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import NodeDescription from '../NodeDescription.svelte';
	import { getNodeTitle } from '$lib/node_metadata';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
</script>

{#snippet not_icon()}
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 9h14M5 15h14m0-10L5 19"/>
	</svg>
{/snippet}

<Node
	{id}
	title={getNodeTitle('not_node')}
	color="#4A1E1E"
	text_color="#F87171"
	{enabled}
	{error_message}
	{selected}
	icon={not_icon}
	handles={[
		{
			id: 'not_node_target_1',
			type: 'target',
			valid_types: 'bool'
		},
		{
			id: 'not_node_source_1',
			type: 'source',
			valid_types: 'bool'
		}
	]}
>
	<NodeDescription nodeType='not_node' />
</Node>

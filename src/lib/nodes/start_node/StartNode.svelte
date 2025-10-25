<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import { getNodeTitle } from '$lib/node_metadata';

	let { id, data }: NodeProps = $props();
	let error_message: string = $derived(data.error_message as string);
</script>

<Node
	{id}
	title={getNodeTitle('start_node')}
	enabled={true}
	{error_message}
	selected={false}
	handles={[
		{
			id: 'start_node_source_1',
			type: 'source',
			valid_types: 'none'
		}
	]}>Start</Node
>

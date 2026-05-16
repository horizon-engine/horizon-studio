<script lang="ts">
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import type { Variable } from '../../types';
	import { getNodeTitle } from '../../node_metadata';
	import { getTypeDisplay } from '../../type_utils';

	let { id, selected, data }: NodeProps = $props();
	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
	let variable = $derived(data.variable as Variable);
</script>

<Node
	{id}
	title={getNodeTitle('variable_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'variable_node_source_1',
			type: 'source',
			valid_types: variable.type
		}
	]}
>
	<div class="flex-1">
		<div class="text-sm font-medium text-text-primary">{variable.name}</div>
		<div class="overflow-auto text-xs text-text-muted">
			{getTypeDisplay(variable.type)}
		</div>
	</div>
</Node>

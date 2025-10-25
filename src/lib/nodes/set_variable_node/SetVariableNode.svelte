<script lang="ts">
	import type { Variable } from '$lib/types';
	import { coerce_types, getConnectionValidTypes, getTypeDisplay } from '$lib/type_utils';
	import { getNodeTitle } from '$lib/node_metadata';
	import { useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';

	let { id, selected, data }: NodeProps = $props();

	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
	let variables = $derived(data.variables as Variable[]);
	let variable = $state<Variable | undefined>(undefined);

	const { deleteElements, getEdges } = useSvelteFlow();

	function handleChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value;
		variable = variables.find((v) => v.name === selected);
	}

	function deleteInputValueEdge() {
		const edges_to_delete = getEdges().filter(
			(edge) =>
				edge.target === id &&
				edge.targetHandle === 'set_variable_node_target_2' &&
				coerce_types(getConnectionValidTypes(edge), variable?.type ?? null) === null
		);
		if (edges_to_delete.length > 0) {
			deleteElements({
				edges: edges_to_delete
			});
		}
	}

	$effect(() => {
		data.variable = variable?.name;

		deleteInputValueEdge();
	});

	$effect(() => {
		if (!variables.find((v) => v.name === variable?.name)) {
			variable = undefined;
		}
	});
</script>

<Node
	{id}
	title={getNodeTitle('set_variable_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'set_variable_node_target_1',
			type: 'target',
			y_position_percents: 57,
			valid_types: 'none'
		},
		{
			id: 'set_variable_node_target_2',
			type: 'target',
			y_position_percents: 86,
			valid_types: variable?.type ?? null
		},
		{
			id: 'set_variable_node_source_1',
			type: 'source',
			valid_types: 'none'
		}
	]}
>
	<select class="rounded-xs py-0.5 pr-8 pl-2" value={variable?.name || ''} onchange={handleChange}>
		<option value="">Select a variable</option>
		{#each variables as variable}
			<option value={variable.name}>{variable.name}</option>
		{/each}
	</select>
	<div class="mt-4 text-xs text-text-muted">►</div>
	<div class="mt-4 overflow-auto text-xs text-text-muted">
		value {variable ? '(' + getTypeDisplay(variable.type) + ')' : ''}
	</div>
</Node>

<script lang="ts">
	import type { Type } from '../../types';
	import { defaultValue } from '../../type_utils';
	import { getNodeTitle } from '../../node_metadata';
	import { type NodeProps } from '@xyflow/svelte';
	import Node from '../Node.svelte';
	import TypeSelector from '../../components/TypeSelector.svelte';
	import ValueInput from './value_input/ValueInput.svelte';

	let { id, selected, data }: NodeProps = $props();

	let enabled: boolean = $derived(data.enabled as boolean);
	let error_message: string = $derived(data.error_message as string);
	let type: Type = $derived(data.type as Type);
	let value: number | boolean | string | never[] = $derived(defaultValue(type));
	let node: Node | undefined;

	$effect(() => {
		data.value = value;
	});

	$effect(() => {
		if (JSON.stringify(type) === JSON.stringify(data.type)) {
			return;
		}
		data.type = type;
		node?.updateNodeEdges();
	});
</script>

<Node
	bind:this={node}
	{id}
	title={getNodeTitle('value_node')}
	{enabled}
	{error_message}
	{selected}
	handles={[
		{
			id: 'value_node_source_1',
			type: 'source',
			valid_types: type
		}
	]}
>
	<TypeSelector bind:type class="mb-2" />
	<ValueInput {type} bind:value />
</Node>

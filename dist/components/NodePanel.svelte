<script lang="ts">
	import type { Variable } from '../types';
	import NodeLibrary from './NodeLibrary.svelte';
	import type { Node } from '@xyflow/svelte';
	import Panel from './Panel.svelte';

	let { variables, addNode } = $props<{ variables: Variable[]; addNode: (node: Node) => void }>();
</script>

<Panel title="Nodes">
	<NodeLibrary {variables} {addNode} />
</Panel>

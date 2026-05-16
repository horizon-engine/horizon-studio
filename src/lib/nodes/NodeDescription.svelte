<script lang="ts">
	import { getNodeShortDescription } from '$lib/node_metadata';

	let { nodeType } = $props<{ nodeType: string }>();
</script>

<div class="my-1 space-y-3">
	<div class="flex flex-col justify-between space-y-3">
		<div class="flex-1 text-right">
			<div class="text-xs text-text-muted">{getNodeShortDescription(nodeType)}</div>
		</div>
	</div>
</div>
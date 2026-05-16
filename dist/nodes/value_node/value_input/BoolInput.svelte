<script lang="ts">
	let { value = $bindable() } = $props<{ value: boolean }>();
</script>

<label class="inline-flex items-center space-x-2">
	<input type="checkbox" bind:checked={value} />
	<span>{value ? 'True' : 'False'}</span>
</label>

<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';

	let { value = $bindable() } = $props<{ value: string }>();
</script>

<TextInput
	inputmode="text"
	{value}
	placeholder="Enter a string"
	oninput={(e) => {
		value = (e.target as HTMLInputElement).value;
	}}
/>

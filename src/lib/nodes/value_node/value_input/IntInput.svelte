<script lang="ts">
	import TextInput from '$lib/components/TextInput.svelte';

	let { value = $bindable() } = $props<{ value: number }>();

	let input: string = $derived(String(value));

	function handleChange(newInput: string) {
		const isValidInteger = /^-?\d*$/.test(newInput);
		if (!isValidInteger) return;
		value = parseInt(newInput, 10) || 0;
		input = newInput;
	}

	function handleBlur(input: string) {
		const formatted = String(parseInt(input, 10) || 0);
		if (formatted !== input) handleChange(formatted);
	}
</script>

<TextInput
	inputmode="decimal"
	value={input}
	placeholder="Enter an integer"
	oninput={(e) => handleChange((e.target as HTMLInputElement).value)}
	onblur={(e) => handleBlur((e.target as HTMLInputElement).value)}
/>

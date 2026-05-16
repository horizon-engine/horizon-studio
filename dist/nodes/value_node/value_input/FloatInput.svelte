<script lang="ts">
	import TextInput from '../../../components/TextInput.svelte';

	let { value = $bindable() } = $props<{ value: number }>();

	let input: string = $derived(String(value));

	function handleChange(newInput: string) {
		const isValidFloat = /^-?(\d+(\.\d*)?)?$/.test(newInput);
		if (!isValidFloat) return;
		value = parseFloat(newInput) || 0;
		input = newInput;
	}

	function handleBlur(input: string) {
		const formatted = String(parseFloat(input) || 0);
		if (formatted !== input) handleChange(formatted);
	}
</script>

<TextInput
	inputmode="decimal"
	value={input}
	placeholder="Enter a float"
	oninput={(e) => handleChange((e.target as HTMLInputElement).value)}
	onblur={(e) => handleBlur((e.target as HTMLInputElement).value)}
/>

<script lang="ts">
	import type { Type, Variable } from '$lib/types';
	import TypeSelector from './TypeSelector.svelte';
	import TextInput from './TextInput.svelte';
	import { toast } from 'svelte-5-french-toast';
	import { getTypeDisplay } from '$lib/type_utils';
	import { useDnD } from '$lib/providers/DnDProvider.svelte';
	import Panel from './Panel.svelte';
	import Button from './Button.svelte';
	import Trash2 from 'virtual:icons/lucide/trash2';

	const type = useDnD();

	let {
		variables = [],
		onAddVariable,
		confirmDeleteVariable,
		onReorderVariables
	} = $props<{
		variables: Variable[];
		onAddVariable: (variable: Variable) => void;
		confirmDeleteVariable: (name: string) => Promise<boolean>;
		onReorderVariables: (variables: Variable[]) => void;
	}>();

	let newVarName = $state('');
	let newVarType = $state<Type>('int');
	let draggedIndex = $state<number | null>(null);
	let dragging_group: HTMLDivElement | undefined = $state(undefined);

	function onReorderDragStart(event: DragEvent, index: number) {
		if (!event.dataTransfer) return;

		if (dragging_group) dragging_group.classList.add('is-dragging');

		draggedIndex = index;
		event.dataTransfer.effectAllowed = 'move';

		const variable = variables[index];
		type.current = JSON.stringify({
			type: 'variable_node',
			data: {
				enabled: false,
				error_message: '',
				variable: { type: getTypeDisplay(variable.type), name: variable.name }
			}
		});
	}

	function onReorderDragOver(event: DragEvent, index: number) {
		event.preventDefault();

		if (draggedIndex === null || draggedIndex === index) {
			return;
		}

		const newVariables = [...variables];
		const [draggedItem] = newVariables.splice(draggedIndex, 1);
		newVariables.splice(index, 0, draggedItem);

		variables = newVariables;
		draggedIndex = index;
	}

	function onReorderDrop(event: DragEvent) {
		event.preventDefault();
		draggedIndex = null;
		onReorderVariables(variables);
	}

	function onReorderDragEnd() {
		draggedIndex = null;
		if (dragging_group) dragging_group.classList.remove('is-dragging');
		onReorderVariables(variables);
	}

	function addVariable() {
		const trimmedName = newVarName.trim();

		if (!trimmedName) return;

		if (variables.find((v: Variable) => v.name === trimmedName)) {
			toast.error('Variable name already in use.');
			return;
		}

		const newVar: Variable = {
			name: newVarName.trim(),
			type: newVarType
		};

		variables = [...variables, newVar];
		newVarName = '';
		newVarType = 'int';
		onAddVariable(newVar);
	}

	async function deleteVariable(name: string) {
		if (await confirmDeleteVariable(name)) {
			variables = variables.filter((v: Variable) => v.name !== name);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			addVariable();
		}
	}
</script>

<Panel title="Variables">
	<div class="flex h-full min-h-0 flex-col">
		<!-- Variable List -->
		<div class="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
			{#if variables.length === 0}
				<div class="flex h-full w-full items-center justify-center">
					<p class="text-sm text-text-secondary">No variable yet.</p>
				</div>
			{:else}
				<div class="group/dragging space-y-2 transition-all" bind:this={dragging_group}>
					{#each variables as variable, index (variable.name)}
						<div
							role="button"
							tabindex="0"
							class="group/hover relative w-full flex-1 cursor-grab overflow-hidden rounded-md border border-border-medium bg-surface p-2.5 transition-all hover:border-border-strong hover:bg-surface-elevated hover:shadow-sm"
							ondragstart={(event: DragEvent) => {
								const dragImage = (event.currentTarget as HTMLDivElement).cloneNode(
									true
								) as HTMLDivElement;
								const width = (event.currentTarget as HTMLDivElement).offsetWidth;
								dragImage.style.position = 'absolute';
								dragImage.style.top = '-9999px';
								dragImage.style.left = '-9999px';
								dragImage.style.width = `${width}px`;
								dragImage.style.opacity = '1';
								document.body.appendChild(dragImage);
								event.dataTransfer?.setDragImage(dragImage, event.offsetX, event.offsetY);
								setTimeout(() => {
									document.body.removeChild(dragImage);
								}, 0);
								onReorderDragStart(event, index);
							}}
							ondragover={(event) => onReorderDragOver(event, index)}
							ondrop={(event) => onReorderDrop(event)}
							ondragend={onReorderDragEnd}
							draggable={true}
						>
							<div class="min-w-0 truncate text-sm font-medium text-text-primary">
								{variable.name}
							</div>
							<div class="min-w-0 truncate text-xs text-text-muted">
								{getTypeDisplay(variable.type)}
							</div>
							<button
								onclick={() => deleteVariable(variable.name)}
								aria-label="Delete variable"
								class="absolute top-0 right-0 flex h-full w-14 translate-x-14 items-center justify-center bg-error-muted text-text-secondary transition-transform group-hover/hover:translate-x-0 group-[.is-dragging]/dragging:hidden hover:text-error"
							>
								<Trash2 />
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		<!-- Add Variable Section -->
		<div class="border-t-2 border-border-strong bg-surface p-4">
			<div class="space-y-3">
				<div class="grid w-full grid-cols-2 gap-3">
					<TextInput
						value={newVarName}
						placeholder="Variable name"
						label="Name"
						showClearButton={true}
						onblur={(e) => (newVarName = (e.target as HTMLInputElement).value)}
						oninput={(e) => (newVarName = (e.target as HTMLInputElement).value)}
						onkeydown={(event: KeyboardEvent) => {
							handleKeydown(event);
						}}
					/>
					<div class="flex flex-col">
						<span class="mb-0.5 text-xs font-medium text-text-primary">Type</span>
						<TypeSelector bind:type={newVarType} indent={false} />
					</div>
				</div>
				<Button
					onclick={addVariable}
					onkeydown={handleKeydown}
					disabled={!newVarName.trim()}
					class="w-full justify-center !rounded-md bg-linear-to-r from-primary-muted to-secondary-muted !py-2 text-sm font-medium text-text-inverted shadow-sm transition-all hover:from-primary-dark hover:to-secondary-dark hover:shadow disabled:cursor-not-allowed disabled:from-border-medium disabled:to-border-strong disabled:text-text-muted disabled:shadow-none"
				>
					<span class="flex items-center justify-center gap-2"> Add Variable </span>
				</Button>
			</div>
		</div>
	</div>
</Panel>

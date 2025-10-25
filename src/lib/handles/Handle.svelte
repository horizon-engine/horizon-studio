<script lang="ts">
	import type { HandleType } from '$lib/types';
	import { getTypeColors } from '$lib/type_utils';
	import {
		Handle,
		Position,
		useNodeConnections,
		type HandleProps,
		type IsValidConnection
	} from '@xyflow/svelte';

	type CustomHandleProps = Omit<HandleProps, 'position' | 'id' | 'isValidConnection'> & {
		node_id: string;
		id: string;
		isValidConnection: IsValidConnection;
		y_position_percents?: number;
		valid_types: HandleType | null;
	};

	let props: CustomHandleProps = $props();
	let props_to_pass_directly = $derived({
		...props,
		node_id: undefined,
		isValidConnection: undefined,
		y_position_percents: undefined
	});

	const connections = useNodeConnections();
	let isConnectable = $derived(
		(props.type === 'target' &&
			connections.current.filter(
				(connection) => connection.target === props.node_id && connection.targetHandle === props.id
			).length === 0) ||
			(props.type === 'source' &&
				connections.current.filter(
					(connection) =>
						connection.source === props.node_id && connection.sourceHandle === props.id
				).length === 0)
	);

	let colors = $derived(getTypeColors(props.valid_types));

	// the calculation for the top position is done to ignore the height of the handle/title
	let handleProps = $derived({
		...props_to_pass_directly,
		style: `
		background: conic-gradient(
		${colors
			.map((c, i) => `${c} ${(i * 360) / colors.length}deg ${((i + 1) * 360) / colors.length}deg`)
			.join(', ')}
		);
		border: 0;
		width: 10px;
		height: 10px;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease;
		${props.style || ''}
		transform-origin: top ${props.type === 'target' ? 'left' : 'right'};
		top: calc((100% - 2rem) * ${(props.y_position_percents ?? 50) / 100} + 2rem);
		right: ${props.type === 'source' ? '0.5px' : 'auto'};
		left: ${props.type === 'target' ? '0.5px' : 'auto'};
		`
	});
</script>

<Handle
	position={props.type === 'target' ? Position.Left : Position.Right}
	{...handleProps}
	{isConnectable}
	isValidConnection={props.isValidConnection}
	class="hover:scale-120 hover:shadow-[0_0_0_2px_rgba(0,0,0,0.2)]"
/>

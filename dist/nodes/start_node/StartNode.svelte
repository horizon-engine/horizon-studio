<script lang="ts">
    import { type NodeProps } from '@xyflow/svelte';
    import Node from '../Node.svelte';
    import { getNodeTitle } from '../../node_metadata';

    let { id, data }: NodeProps = $props();
    let error_message: string = $derived(data.error_message as string);
</script>

{#snippet start_icon()}
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" style="color: #22c55e;">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
    </svg>
{/snippet}

<Node
    {id}
    title={getNodeTitle('start_node')}
    color="#1D3C36"
    text_color="#22c55e"
    enabled={true}
    {error_message}
    selected={false}
    icon={start_icon}
    handles={[
        {
            id: 'start_node_source_1',
            type: 'source',
            valid_types: 'none'
        }
    ]}>
    Start
</Node>
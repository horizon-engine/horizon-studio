import StartNode from '$lib/nodes/start_node/StartNode.svelte';
import ValueNode from '$lib/nodes/value_node/ValueNode.svelte';
import VariableNode from '$lib/nodes/variable_node/VariableNode.svelte';
import IfNode from '$lib/nodes/if_node/IfNode.svelte';
import NotNode from '$lib/nodes/unary_operators/NotNode.svelte';
import WhileNode from '$lib/nodes/while_node/WhileNode.svelte';
import AddNode from '$lib/nodes/binary_operators/AddNode.svelte';
import SubtractNode from '$lib/nodes/binary_operators/SubtractNode.svelte';
import MultiplyNode from '$lib/nodes/binary_operators/MultiplyNode.svelte';
import DivideNode from '$lib/nodes/binary_operators/DivideNode.svelte';
import ModuloNode from '$lib/nodes/binary_operators/ModuloNode.svelte';
import EqualityNode from '$lib/nodes/binary_operators/EqualityNode.svelte';
import InequalityNode from '$lib/nodes/binary_operators/InequalityNode.svelte';
import AndNode from '$lib/nodes/binary_operators/AndNode.svelte';
import OrNode from '$lib/nodes/binary_operators/OrNode.svelte';
import LessThanNode from '$lib/nodes/binary_operators/LessThanNode.svelte';
import LessThanOrEqualNode from '$lib/nodes/binary_operators/LessThanOrEqualNode.svelte';
import GreaterThanNode from '$lib/nodes/binary_operators/GreaterThanNode.svelte';
import GreaterThanOrEqualNode from '$lib/nodes/binary_operators/GreaterThanOrEqualNode.svelte';
import SetVariableNode from '$lib/nodes/set_variable_node/SetVariableNode.svelte';
import GroupNode from '$lib/nodes/group_node/GroupNode.svelte';
import PostitNode from '$lib/nodes/postit_node/PostitNode.svelte';

export const nodeTypes = {
    start_node: StartNode,
    value_node: ValueNode,
    variable_node: VariableNode,
    if_node: IfNode,
    while_node: WhileNode,
    not_node: NotNode,
    add_node: AddNode,
    subtract_node: SubtractNode,
    multiply_node: MultiplyNode,
    divide_node: DivideNode,
    modulo_node: ModuloNode,
    equality_node: EqualityNode,
    inequality_node: InequalityNode,
    and_node: AndNode,
    or_node: OrNode,
    less_than_node: LessThanNode,
    less_than_or_equal_node: LessThanOrEqualNode,
    greater_than_node: GreaterThanNode,
    greater_than_or_equal_node: GreaterThanOrEqualNode,
    set_variable_node: SetVariableNode,
    group_node: GroupNode,
    postit_node: PostitNode
};

import StartNode from './nodes/start_node/StartNode.svelte';
import ValueNode from './nodes/value_node/ValueNode.svelte';
import VariableNode from './nodes/variable_node/VariableNode.svelte';
import IfNode from './nodes/if_node/IfNode.svelte';
import NotNode from './nodes/unary_operators/NotNode.svelte';
import WhileNode from './nodes/while_node/WhileNode.svelte';
import AddNode from './nodes/binary_operators/AddNode.svelte';
import SubtractNode from './nodes/binary_operators/SubtractNode.svelte';
import MultiplyNode from './nodes/binary_operators/MultiplyNode.svelte';
import DivideNode from './nodes/binary_operators/DivideNode.svelte';
import ModuloNode from './nodes/binary_operators/ModuloNode.svelte';
import EqualityNode from './nodes/binary_operators/EqualityNode.svelte';
import InequalityNode from './nodes/binary_operators/InequalityNode.svelte';
import AndNode from './nodes/binary_operators/AndNode.svelte';
import OrNode from './nodes/binary_operators/OrNode.svelte';
import LessThanNode from './nodes/binary_operators/LessThanNode.svelte';
import LessThanOrEqualNode from './nodes/binary_operators/LessThanOrEqualNode.svelte';
import GreaterThanNode from './nodes/binary_operators/GreaterThanNode.svelte';
import GreaterThanOrEqualNode from './nodes/binary_operators/GreaterThanOrEqualNode.svelte';
import SetVariableNode from './nodes/set_variable_node/SetVariableNode.svelte';
import GroupNode from './nodes/group_node/GroupNode.svelte';
import PostitNode from './nodes/postit_node/PostitNode.svelte';
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

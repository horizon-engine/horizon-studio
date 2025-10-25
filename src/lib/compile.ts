import type { Edge, Node } from "@xyflow/svelte";
import type { Type, Variable } from "./types";

function get_type_name(type: Type): any {
    if (typeof type === 'object' && 'arrayOf' in type) {
        return {
            Array: get_type_name(type.arrayOf)
        }
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function get_node_input(nodes: Node[], edges: Edge[], node_id: string, handle_id: string): Node | null {
    const input = edges.filter((edge) => edge.target === node_id && edge.targetHandle === handle_id)
        .map((edge) => nodes.find((node) => node.id === edge.source))
        .filter((node) => node !== undefined);
    return input.length === 1 ? input[0] : null;
}

function get_node_output(nodes: Node[], edges: Edge[], node_id: string, handle_id: string): Node | null {
    const output = edges.filter((edge) => edge.source === node_id && edge.sourceHandle === handle_id)
        .map((edge) => nodes.find((node) => node.id === edge.target))
        .filter((node) => node !== undefined);
    return output.length === 1 ? output[0] : null;
}

function compile_start_node(nodes: Node[], edges: Edge[], node: Node): any {
    const output_node = get_node_output(nodes, edges, node.id, 'start_node_source_1');
    return {
        body: output_node ? compile_node(nodes, edges, output_node) : []
    }
}

function compile_if_node(nodes: Node[], edges: Edge[], node: Node): any[] {
    let condition = get_node_input(nodes, edges, node.id, 'if_node_target_2');
    if (condition === null) {
        throw new Error('a condition is required', { cause: node.id });
    }
    condition = compile_node(nodes, edges, condition);

    let then_body: any = get_node_output(nodes, edges, node.id, 'if_node_source_1');
    then_body = then_body ? compile_node(nodes, edges, then_body) : [];

    let else_body: any = get_node_output(nodes, edges, node.id, 'if_node_source_2');
    else_body = else_body ? compile_node(nodes, edges, else_body) : [];

    let finally_body: any = get_node_output(nodes, edges, node.id, 'if_node_source_3');
    finally_body = finally_body ? compile_node(nodes, edges, finally_body) : [];

    return [
        {
            source_map: node.id,
            value: {
                If: {
                    condition: condition,
                    then_body: { body: then_body },
                    else_body: { body: else_body },
                },
            }
        },
        ...finally_body
    ];
}

function compile_while_node(nodes: Node[], edges: Edge[], node: Node): any[] {
    let condition = get_node_input(nodes, edges, node.id, 'while_node_target_2');
    if (condition === null) {
        throw new Error('a condition is required', { cause: node.id });
    }
    condition = compile_node(nodes, edges, condition);

    let body: any = get_node_output(nodes, edges, node.id, 'while_node_source_1');
    body = body ? compile_node(nodes, edges, body) : [];

    let finally_body: any = get_node_output(nodes, edges, node.id, 'while_node_source_2');
    finally_body = finally_body ? compile_node(nodes, edges, finally_body) : [];

    return [
        {
            source_map: node.id,
            value: {
                While: {
                    condition: condition,
                    body: { body: body },
                },
            }
        },
        ...finally_body
    ];
}

function compile_set_variable_node(nodes: Node[], edges: Edge[], node: Node): any[] {
    let value = get_node_input(nodes, edges, node.id, 'set_variable_node_target_2');
    if (value === null) {
        throw new Error('a value is required', { cause: node.id });
    }
    value = compile_node(nodes, edges, value);
    let variable_name = node.data.variable ?? undefined;
    if (variable_name === undefined) {
        throw new Error('a variable must be selected', { cause: node.id });
    }

    let finally_body: any = get_node_output(nodes, edges, node.id, 'set_variable_node_source_1');
    finally_body = finally_body ? compile_node(nodes, edges, finally_body) : [];

    return [
        {
            source_map: node.id,
            value: {
                VariableAssignment: {
                    name: variable_name,
                    value: value
                }
            }
        },
        ...finally_body
    ];
}

function compile_value_node(node: Node): any {
    let type = node.data.type;
    if (type === undefined) {
        throw new Error('a type is required', { cause: node.id });
    }
    let value = node.data.value;
    if (value === undefined) {
        throw new Error('a value is required', { cause: node.id });
    }

    function generate_value_object(type: any, value: any): any {
        if (type === 'int') {
            return {
                Int: Math.floor(value as number)
            }
        }

        if (type === 'float') {
            return {
                Float: value as number
            }
        }

        if (type === 'string') {
            return {
                String: value as string
            }
        }

        if (type === 'bool') {
            return {
                Bool: value ? true : false
            }
        }

        if (typeof type === 'object' && 'arrayOf' in type) {
            return {
                Array: {
                    elements: value.map((val: any) => {
                        return {
                            source_map: node.id,
                            value: {
                                Value: generate_value_object(type.arrayOf, val)
                            }
                        }
                    }),
                    type: get_type_name(type.arrayOf)
                }
            }
        }
    }

    return {
        source_map: node.id,
        value: {
            Value: generate_value_object(type as string, value)
        }
    }

}

function compile_variable_node(node: Node): any {
    return {
        source_map: node.id,
        value: {
            Variable: (node.data as any).variable.name
        }
    }
}

function compile_not_node(nodes: Node[], edges: Edge[], node: Node): any {
    let operand = get_node_input(nodes, edges, node.id, 'not_node_target_1');
    if (operand === null) {
        throw new Error('an operand is required', { cause: node.id });
    }

    return {
        source_map: node.id,
        value: {
            UnaryOperator: {
                operator: 'Not',
                operand: compile_node(nodes, edges, operand)
            }
        }
    }
}

function compile_binary_operator_node(nodes: Node[], edges: Edge[], node: Node): any {
    const operand1 = get_node_input(nodes, edges, node.id, `${node.type}_target_1`);
    const operand2 = get_node_input(nodes, edges, node.id, `${node.type}_target_2`);
    if (operand1 === null || operand2 === null) {
        throw new Error('two operands are required', { cause: node.id });
    }

    const operator_map = new Map([
        ['add_node', 'Add'],
        ['subtract_node', 'Subtract'],
        ['multiply_node', 'Multiply'],
        ['divide_node', 'Divide'],
        ['modulo_node', 'Modulo'],
        ['equality_node', 'Equal'],
        ['inequality_node', 'NotEqual'],
        ['and_node', 'And'],
        ['or_node', 'Or'],
        ['less_than_node', 'LessThan'],
        ['less_than_or_equal_node', 'LessThanOrEqual'],
        ['greater_than_node', 'GreaterThan'],
        ['greater_than_or_equal_node', 'GreaterThanOrEqual']
    ]);

    return {
        source_map: node.id,
        value: {
            BinaryOperator: {
                operator: operator_map.get(node.type!)!,
                left: compile_node(nodes, edges, operand1),
                right: compile_node(nodes, edges, operand2)
            }
        }
    }
}

function compile_node(nodes: Node[], edges: Edge[], node: Node): any {
    switch (node.type) {
        case 'start_node':
            return compile_start_node(nodes, edges, node);
        case 'if_node':
            return compile_if_node(nodes, edges, node);
        case 'while_node':
            return compile_while_node(nodes, edges, node);
        case 'set_variable_node':
            return compile_set_variable_node(nodes, edges, node);
        case 'value_node':
            return compile_value_node(node);
        case 'variable_node':
            return compile_variable_node(node);
        case 'not_node':
            return compile_not_node(nodes, edges, node);
        case 'add_node':
        case 'subtract_node':
        case 'multiply_node':
        case 'divide_node':
        case 'modulo_node':
        case 'equality_node':
        case 'inequality_node':
        case 'and_node':
        case 'or_node':
        case 'less_than_node':
        case 'less_than_or_equal_node':
        case 'greater_than_node':
        case 'greater_than_or_equal_node':
            return compile_binary_operator_node(nodes, edges, node);
    }
}

export function compile(variables: Variable[], nodes: Node[], edges: Edge[]) {
    return {
        variables: variables.map((variable) => ({ [variable.name]: get_type_name(variable.type) })),
        body: compile_node(nodes, edges, nodes.find((node) => node.id === 'start_node')!)
    };
}

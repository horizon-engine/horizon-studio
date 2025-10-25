export function getNodeTitle(node_type: string): string {
    switch (node_type) {
        case 'start_node':
            return 'Start';
        case 'value_node':
            return 'Value';
        case 'variable_node':
            return 'Variable';
        case 'set_variable_node':
            return 'Set Variable';
        case 'if_node':
            return 'If';
        case 'while_node':
            return 'While';
        case 'not_node':
            return 'Not';
        case 'add_node':
            return 'Add';
        case 'subtract_node':
            return 'Subtract';
        case 'multiply_node':
            return 'Multiply';
        case 'divide_node':
            return 'Divide';
        case 'modulo_node':
            return 'Modulo';
        case 'equality_node':
            return '=';
        case 'inequality_node':
            return '≠';
        case 'and_node':
            return 'And';
        case 'or_node':
            return 'Or';
        case 'less_than_node':
            return '<';
        case 'less_than_or_equal_node':
            return '≤';
        case 'greater_than_node':
            return '>';
        case 'greater_than_or_equal_node':
            return '≥';
        case 'group_node':
            return 'Group';
        case 'postit_node':
            return 'Post-it';
        default:
            return 'Unknown';
    }
}

export function getNodeShortDescription(node_type: string): string {
    switch (node_type) {
        case 'value_node':
            return 'A literal value.';
        case 'variable_node':
            return 'A variable.';
        case 'set_variable_node':
            return 'Set a variable to a value.';
        case 'if_node':
            return 'Conditional statement.';
        case 'while_node':
            return 'Loop while a condition is true.';
        case 'not_node':
            return 'inverse a boolean value.';
        case 'add_node':
            return 'Add two values.';
        case 'subtract_node':
            return 'Subtract a value from another.';
        case 'multiply_node':
            return 'Multiply two values.';
        case 'divide_node':
            return 'Divide two values.';
        case 'modulo_node':
            return 'Remainder of a division.';
        case 'equality_node':
            return 'Test if two values are equal.';
        case 'inequality_node':
            return 'Test if two values are not equal.';
        case 'and_node':
            return 'Check if both values are true.';
        case 'or_node':
            return 'Check if either value is true.';
        case 'less_than_node':
            return 'Test if a value is smaller than another.';
        case 'less_than_or_equal_node':
            return 'Test if a value is smaller than or equal to another.';
        case 'greater_than_node':
            return 'Test if a value is larger than another.';
        case 'greater_than_or_equal_node':
            return 'Test if a value is larger than or equal to another.';
        case 'group_node':
            return 'Utility node to group multiple nodes and give them a title.';
        case 'postit_node':
            return 'A post-it note.';
        default:
            return '';
    }
}

// additional search terms to help with fuzzy search
export function getNodeSearchTerms(node_type: string): string {
    switch (node_type) {
        case 'value_node':
            return 'constant number string text array bool int float'
        case 'variable_node':
            return 'var get read value'
        case 'set_variable_node':
            return 'assign store write let const var ='
        case 'if_node':
            return 'branch conditional then else ternary ?'
        case 'while_node':
            return 'repeat'
        case 'not_node':
            return '! negate invert flip'
        case 'add_node':
            return '+ plus sum'
        case 'subtract_node':
            return '- minus difference'
        case 'multiply_node':
            return '* x times product'
        case 'divide_node':
            return '/ division quotient'
        case 'modulo_node':
            return '%'
        case 'equality_node':
            return '== equals compare comparison'
        case 'inequality_node':
            return '!= not'
        case 'and_node':
            return '&& both all'
        case 'or_node':
            return '|| either any'
        case 'less_than_node':
            return 'smaller below under'
        case 'less_than_or_equal_node':
            return '<= smaller below under'
        case 'greater_than_node':
            return 'bigger above over'
        case 'greater_than_or_equal_node':
            return '>= bigger above over'
        case 'group_node':
            return 'comment organize container box frame'
        case 'postit_node':
            return 'comment note annotation sticky memo label'
        default:
            return ''
    }
}

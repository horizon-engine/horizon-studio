# Horizon Studio Editor

A visual node-based editor interface built with SvelteKit. Perfect for creating visual programming tools, workflow builders, or any node-based editing interface.

## Features

- 🎨 Visual node-based editor with drag-and-drop support
- 🔗 Connect nodes with handles and edges
- 📦 Pre-built node types (binary operators, control flow, variables, etc.)
- 🎯 Auto-layout algorithm for organizing nodes
- 🧩 Fully typed with TypeScript
- ⚡ Built with Svelte 5 and SvelteKit
- 🎭 Dark/Light mode support
- 🔌 Extensible architecture for custom nodes

## Installation

### Via GitHub (Direct Git Installation)

```bash
npm install github:your-username/horizon-studio
# or
pnpm add github:your-username/horizon-studio
```

Replace `your-username` with your actual GitHub username.

### From Local Repository

```bash
npm install file:../path/to/horizon-studio
```

## Usage

### Basic Setup

```svelte
<script>
  import { 
    DnDProvider, 
    NodeLibrary, 
    NodePanel,
    VariableManager,
    state 
  } from '@horizonstudio/editor';
</script>

<DnDProvider>
  <div class="flex h-screen gap-4 p-4">
    <!-- Left sidebar: Node library -->
    <NodeLibrary />
    
    <!-- Center: Main editor -->
    <div class="flex-1">
      <NodePanel />
    </div>
    
    <!-- Right sidebar: Variables -->
    <VariableManager />
  </div>
</DnDProvider>

<style>
  :global(html) {
    height: 100%;
  }
  
  :global(body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }
</style>
```

### Using Components

#### Available Components

- **`DnDProvider`** - Provides drag-and-drop functionality
- **`NodeLibrary`** - Shows available node types
- **`NodePanel`** - Main editor area displaying nodes
- **`VariableManager`** - Manage variables and data
- **`AlertDialog`** - Alert dialog component
- **`Button`** - Reusable button component
- **`TextInput`** - Text input component
- **`FloatingPanel`** - Floating panel container
- **`Panel`** - Generic panel component

#### Using the State

```svelte
<script>
  import { state } from '@horizonstudio/editor';
  
  // Add a node
  function addNode() {
    state.addNode({
      id: 'node-1',
      type: 'value',
      position: { x: 100, y: 100 },
      data: {}
    });
  }
  
  // Get all nodes
  const nodes = state.nodes;
  
  // Get all edges
  const edges = state.edges;
  
  // Add an edge
  state.addEdge({
    id: 'edge-1',
    source: 'node-1',
    sourceHandle: 'output',
    target: 'node-2',
    targetHandle: 'input'
  });
</script>
```

## Available Node Types

### Binary Operators
- `AddNode` - Addition
- `SubtractNode` - Subtraction
- `MultiplyNode` - Multiplication
- `DivideNode` - Division
- `ModuloNode` - Modulo
- `AndNode` - Logical AND
- `OrNode` - Logical OR
- `EqualityNode` - Equality comparison
- `InequalityNode` - Inequality comparison
- `LessThanNode` - Less than comparison
- `LessThanOrEqualNode` - Less than or equal comparison
- `GreaterThanNode` - Greater than comparison
- `GreaterThanOrEqualNode` - Greater than or equal comparison

### Control Flow
- `IfNode` - Conditional branching
- `WhileNode` - Loop construct
- `StartNode` - Entry point

### Data
- `ValueNode` - Constant value
- `VariableNode` - Variable reference
- `SetVariableNode` - Variable assignment

### Grouping
- `GroupNode` - Group nodes together
- `PostitNode` - Annotation/note

## Customization

### Adding Custom Nodes

Create a custom node by extending the base node structure:

```svelte
<script>
  import { NodeDescription } from '@horizonstudio/editor';
</script>

<NodeDescription
  title="Custom Node"
  inputs={[{ name: 'input', type: 'any' }]}
  outputs={[{ name: 'output', type: 'any' }]}
>
  <!-- Your custom node content -->
</NodeDescription>
```

### Styling

The package uses Tailwind CSS for styling. Include it in your project's `tailwind.config.js`:

```js
export default {
  content: [
    './src/**/*.{svelte,js,ts}',
    './node_modules/@horizonstudio/editor/**/*.{svelte,js,ts}'
  ],
  // your other config...
};
```

## API Reference

### `state` Object

- `nodes` - Readonly store of all nodes
- `edges` - Readonly store of all edges
- `variables` - Readonly store of all variables
- `addNode(node)` - Add a new node
- `removeNode(id)` - Remove a node
- `updateNode(id, updates)` - Update a node's properties
- `addEdge(edge)` - Add an edge
- `removeEdge(id)` - Remove an edge
- `addVariable(variable)` - Add a variable
- `removeVariable(id)` - Remove a variable

### Node Types

```typescript
interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  selected?: boolean;
  dragging?: boolean;
}

interface Edge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

interface Variable {
  id: string;
  name: string;
  type: string;
  value: any;
}
```

## Development

### Build the Package

```bash
pnpm install
pnpm run build
```

This will generate the distributed files in the `dist` folder.

### Testing

```bash
pnpm run dev
```

Opens a development server at `http://localhost:5173`.

### Type Checking

```bash
pnpm run check
pnpm run check:watch
```

### Linting

```bash
pnpm run lint
pnpm run format
```

## Building for Distribution

To build the package for npm/GitHub Packages distribution:

```bash
pnpm run build
```

The build output will be in the `dist/` directory with:
- JavaScript files with TypeScript definitions
- Source maps
- Compiled Svelte components

## Publishing

### To GitHub Packages

Update your `package.json` with your GitHub username, then:

```bash
npm publish
```

Make sure you have the necessary GitHub credentials configured.

### To npm Registry

```bash
npm publish --access public
```

## Requirements

- Node.js 18+
- Svelte 5+
- SvelteKit 2+

## Dependencies

- `@xyflow/svelte` - Flow diagram library
- `@zag-js/svelte` - UI primitives
- `@dagrejs/dagre` - Graph layout
- `tailwindcss` - Styling
- `nanoid` - ID generation
- `fuse.js` - Fuzzy search

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

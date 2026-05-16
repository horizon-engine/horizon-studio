# 🎯 Quick Start

## Installation Rapide

### Option 1: Via GitHub (la plus simple maintenant)

```bash
npm install github:your-username/horizon-studio
# ou
pnpm add github:your-username/horizon-studio
```

### Option 2: Après publication sur GitHub Packages

```bash
npm install @horizonstudio/editor
```

## Utilisation Basique

```svelte
<!-- src/routes/+page.svelte -->
<script>
  import { DnDProvider, NodePanel, NodeLibrary, VariableManager } from '@horizonstudio/editor';
</script>

<DnDProvider>
  <div class="flex h-screen">
    <NodeLibrary />
    <div class="flex-1">
      <NodePanel />
    </div>
    <VariableManager />
  </div>
</DnDProvider>

<style global>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
  }
</style>
```

## Imports Disponibles

```typescript
// Composants
import { DnDProvider, NodePanel, NodeLibrary, VariableManager } from '@horizonstudio/editor';
import { Button, TextInput, AlertDialog, Panel } from '@horizonstudio/editor';
import { Node, NodeDescription } from '@horizonstudio/editor';

// État et types
import { state } from '@horizonstudio/editor';
import type { Node, Edge, Variable } from '@horizonstudio/editor';

// Utilitaires
import { compileNodes, autoLayout } from '@horizonstudio/editor';
```

## Configuration Tailwind (optionnel)

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{svelte,js,ts}',
    './node_modules/@horizonstudio/editor/dist/**/*.{js,svelte}'
  ]
}
```

## Exemple Complet

```svelte
<script>
  import { DnDProvider, state } from '@horizonstudio/editor';
  import NodePanel from '@horizonstudio/editor';

  onMount(() => {
    // Ajouter un nœud
    state.addNode({
      id: 'start',
      type: 'start',
      position: { x: 0, y: 0 },
      data: {}
    });
  });
</script>

<DnDProvider>
  <NodePanel />
</DnDProvider>
```

---

📖 Pour plus d'informations : consultez `PACKAGE_README.md`
🚀 Pour publier : consultez `PUBLISH.md`
⚙️ Pour configurer : consultez `SETUP.md`

# Guide de Publication sur GitHub Packages

## Étape 1 : Configuration initiale

### 1.1 Mettre à jour le `package.json`

Remplacez `your-username` par votre nom d'utilisateur GitHub :

```json
{
  "name": "@your-username/editor",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/horizon-studio.git"
  }
}
```

### 1.2 Configurer l'authentification GitHub

Créez un token GitHub avec les permissions `packages:write` et `read:packages` :

```bash
# Créez un token sur https://github.com/settings/tokens

# Puis configurez npm/pnpm :
npm config set @horizonstudio:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken=YOUR_TOKEN

# ou avec pnpm :
pnpm config set @horizonstudio:registry https://npm.pkg.github.com
pnpm config set //npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

## Étape 2 : Préparer le package

```bash
# Installer les dépendances
pnpm install

# Vérifier la configuration
pnpm run check

# Vérifier le linting
pnpm run lint

# Construire le package
pnpm run build
```

## Étape 3 : Publier sur GitHub Packages

### Pour la première publication

```bash
# Vérifier que tout est à jour
npm version patch  # ou minor/major selon le changement

# Publier sur GitHub Packages
npm publish
```

### Pour les mises à jour suivantes

```bash
# Mettre à jour la version
npm version patch

# Publier
npm publish
```

## Étape 4 : Utiliser le package

### Installation dans un autre projet

```bash
# Configurer npm/pnpm pour GitHub Packages
npm config set @horizonstudio:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken=YOUR_TOKEN

# Installer le package
npm install @horizonstudio/editor
```

### Ou installation directe via Git

```bash
npm install github:your-username/horizon-studio
# ou
pnpm add github:your-username/horizon-studio
```

## Étape 5 : Utiliser dans un projet SvelteKit

```svelte
<script>
  import { DnDProvider, NodePanel, NodeLibrary, VariableManager } from '@horizonstudio/editor';
</script>

<DnDProvider>
  <!-- Votre interface ici -->
</DnDProvider>
```

## Vérification

### Vérifier la build avec publint

```bash
pnpm run build
```

Cela exécutera `svelte-package` suivi de `publint` pour valider le package.

## Troubleshooting

### Token expiré

Régénérez votre token GitHub et mettez à jour la configuration.

### Package déjà existe

Incrémentez la version dans `package.json` avant de publier à nouveau.

### Problèmes de dépendances

Assurez-vous que :
- Tous les `exports` dans `package.json` sont valides
- Le fichier `src/lib/index.ts` exporte correctement tous les composants
- La configuration Svelte/TypeScript est correcte

## Structure du package publié

```
dist/
├── index.d.ts          # Déclarations TypeScript
├── index.js            # Fichier principal
├── components/         # Composants compilés
├── nodes/              # Nœuds compilés
└── ...                 # Autres fichiers
```

## Notes importantes

1. Le package utilise `@horizonstudio` comme scope. Vous pouvez le changer, mais mettez à jour partout.
2. L'authentification GitHub est requise pour publier sur GitHub Packages.
3. Assurez-vous que votre repository est public si vous voulez permettre l'installation via Git.
4. Les utilisateurs doivent avoir accès au repository pour installer via Git.

## Ressources

- [GitHub Packages Documentation](https://docs.github.com/en/packages)
- [SvelteKit Package Guide](https://kit.svelte.dev/docs/packaging)
- [npm publish documentation](https://docs.npmjs.com/cli/v9/commands/npm-publish)

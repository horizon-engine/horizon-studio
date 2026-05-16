# 🚀 Guide de Configuration et de Publication

## ✅ Étapes Complétées

Ce repository a été configuré comme une **SvelteKit Package** réutilisable. Voici ce qui a été fait :

### Configuration
- ✅ Installation de `@sveltejs/package` et `publint`
- ✅ Mise à jour de `svelte.config.js`
- ✅ Configuration des `exports` dans `package.json`
- ✅ Création de `src/lib/index.ts` avec les exports des composants
- ✅ Ajout des `peerDependencies`
- ✅ Configuration de la build avec `svelte-package`

### Documentation
- ✅ `PACKAGE_README.md` - Guide d'utilisation complet
- ✅ `PUBLISH.md` - Instructions de publication
- ✅ `SETUP.md` - Ce fichier

## 📋 À Faire Maintenant

### 1. Mettre à jour les informations du package

Ouvrez `package.json` et mettez à jour :

```json
{
  "name": "@your-username/editor",  // Remplacez your-username
  "author": "Your Name",             // Votre nom
  "repository": {
    "url": "https://github.com/your-username/horizon-studio.git"
  }
}
```

### 2. Initialiser le repository Git

```bash
cd /home/mateo/Desktop/Epitech/EIP/horizon-studio

# Si ce n'est pas déjà un repo Git
git init

# Ajouter la remote
git remote add origin https://github.com/your-username/horizon-studio.git

# Commit initial
git add .
git commit -m "chore: configure as publishable SvelteKit package"
git push -u origin main
```

### 3. Configuration GitHub Actions (Optionnel)

Créez `.github/workflows/publish.yml` pour publier automatiquement :

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      packages: write
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Tests Avant Publication

```bash
# Vérifier la build
pnpm run build

# Vérifier les types
pnpm run check

# Vérifier le linting
pnpm run lint
```

### 5. Publier sur GitHub Packages

Suivez les instructions dans `PUBLISH.md` pour :
1. Configurer le token GitHub
2. Tester la build
3. Publier le package

## 📦 Installation du Package

Une fois publié, les utilisateurs peuvent installer avec :

### Via GitHub Packages (après configuration)
```bash
npm install @your-username/editor
```

### Via Git (immédiat)
```bash
npm install github:your-username/horizon-studio
```

## 📚 Structure du Package

```
src/lib/
├── index.ts              # Point d'entrée (exporte tout)
├── components/           # Composants UI
├── nodes/                # Composants de nœuds
├── handles/              # Handles de connexion
├── providers/            # Providers (DnDProvider, etc.)
├── stores/               # Svelte stores
├── types.ts              # Définitions de types
└── [autres fichiers]     # Utilitaires et logique
```

## 🎯 Prochaines Étapes Recommandées

1. **Ajouter des tests**
   ```bash
   pnpm add -D vitest @testing-library/svelte
   ```

2. **Ajouter des examples**
   - Créer un dossier `examples/` avec des cas d'usage

3. **Ajouter du CI/CD**
   - Tests automatiques sur les PRs
   - Vérification du linting
   - Publication automatique sur les releases

4. **Documenter les composants**
   - Créer une Storybook
   - Générer une documentation Svelte Docs

5. **Versioning**
   - Utiliser `conventional commits`
   - Automatiser le versioning avec `semantic-release`

## 🔧 Commandes Utiles

```bash
# Développement
pnpm run dev

# Build
pnpm run build

# Vérifier les types et linting
pnpm run check
pnpm run lint

# Formater le code
pnpm run format

# Prévisualiser la build
pnpm run preview
```

## 📖 Ressources

- [SvelteKit Packaging Guide](https://kit.svelte.dev/docs/packaging)
- [GitHub Packages Docs](https://docs.github.com/en/packages)
- [npm Publishing Guide](https://docs.npmjs.com/cli/publish)

## ❓ FAQ

**Q: Comment ajouter de nouveaux composants ?**
A: Créez le composant dans `src/lib/components/` ou `src/lib/nodes/`, puis exportez-le dans `src/lib/index.ts`.

**Q: Comment customiser les styles ?**
A: Le package utilise Tailwind CSS. Les utilisateurs peuvent surcharger les styles via leur propre Tailwind config.

**Q: Comment publier des mises à jour ?**
A: Mettez à jour la version dans `package.json`, commitez, et publiez une nouvelle release sur GitHub.

**Q: Puis-je publier sur npm aussi ?**
A: Oui ! Modifiez `package.json` et publiez sur le registry npm public avec `npm publish`.

---

✨ **Le package est prêt à être publié !** 🚀

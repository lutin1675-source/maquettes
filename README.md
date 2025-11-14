# Perso Maquettes

Site statique généré à partir des dossiers `models/*`. Il rassemble l’historique, le matériel, les visuels et les conseils propres à chaque maquette.

## Prérequis

- Node.js 18+ (pour profiter des API de fichiers modernes)
- `npm` (fourni avec Node)

## Générer le site

```bash
npm install
npm run build
```

Le dossier `dist/` contient les fichiers prêts à être publiés (HTML + CSS). Pour prévisualiser localement :

```bash
npx serve dist
```

## Ajouter une maquette

1. Créer un dossier dans `models/` selon le format `[nom complet]-[fabricant]-[référence]`.
2. Ajouter les fichiers Markdown requis : `index.md`, `historique.md`, `materiel.md`, `visuels.md`, `tips.md`.
3. Relancer `npm run build` pour rafraîchir le site.

Les fichiers Markdown sont rendus tels quels ; privilégier des sections claires et vérifier les sources.

## Publier sur GitHub Pages

Option rapide (branche dédiée) :

1. Générer le site `npm run build`.
2. Copier `dist/` dans une branche `gh-pages` (ex. via `git subtree push --prefix dist origin gh-pages`).
3. Activer GitHub Pages sur la branche `gh-pages`.

Option « Pages depuis le dépôt principal » :

1. Activer GitHub Pages → Source `GitHub Actions`.
2. Utiliser le workflow par défaut « Static HTML » et ajouter une étape `npm run build`.
3. Déployer le contenu du dossier `dist`.

Pensez à reconstruire le site à chaque ajout de maquette et à republier `dist/`.

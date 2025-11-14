# Perso Maquettes (Astro)

Site statique généré avec [Astro](https://astro.build) à partir des dossiers Markdown situés dans `models/`. Chaque maquette dispose d’une page dédiée regroupant historique, matériel, visuels et conseils.

## Structure du dépôt

```
models/
└── [Nom complet]-[Marque]-[Référence]/
    ├── index.md        (synthèse)
    ├── historique.md
    ├── materiel.md
    ├── visuels.md
    └── tips.md
src/
├── lib/models.ts       (lecture + parsing Markdown)
├── pages/index.astro   (catalogue)
└── pages/models/[slug].astro
```

Les fichiers Markdown restent au format libre (pas de front matter imposé). Le parser convertit automatiquement chaque dossier en fiche accessible sous `/models/<slug>/`.

## Développement

```bash
npm install          # installe Astro et markdown-it
npm run dev          # serveur de développement http://localhost:4321
npm run build        # build statique dans dist/
npm run preview      # vérification locale de dist/
```

## Ajouter une maquette

1. Créer un dossier `models/[Nom]-[Marque]-[Référence]/`.
2. Ajouter les 5 fichiers Markdown mentionnés ci-dessus.
3. Lancer `npm run dev` (ou `npm run build`) : Astro détecte automatiquement la nouvelle fiche.

## Publication sur GitHub Pages

Tu peux réutiliser le workflow GitHub Actions classique :

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Active `GitHub Pages > Build and deployment > GitHub Actions`, pousse sur `main` et la branche sera publiée automatiquement (le site reste disponible sous `https://<user>.github.io/maquettes/`).

> ℹ️ Pense à adapter `astro.config.mjs` (propriété `site`/`base`) si tu déploies sous un autre sous-domaine ou un nom de dépôt différent.

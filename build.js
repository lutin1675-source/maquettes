const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const ROOT_DIR = __dirname;
const MODELS_DIR = path.join(ROOT_DIR, 'models');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const ASSETS_SRC_DIR = path.join(ROOT_DIR, 'site');
const ASSETS_DIST_DIR = path.join(DIST_DIR, 'assets');

const DOC_ORDER = [
  { file: 'index.md', title: 'Synthèse' },
  { file: 'historique.md', title: 'Historique' },
  { file: 'materiel.md', title: 'Matériel' },
  { file: 'visuels.md', title: 'Visuels' },
  { file: 'tips.md', title: 'Conseils' },
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFolderMeta(folderName) {
  const matches = [...folderName.matchAll(/\[(.*?)\]/g)].map((match) => match[1]);
  const [modelName, manufacturer, reference] = matches;
  return {
    raw: folderName,
    modelName: modelName || folderName,
    manufacturer: manufacturer || '',
    reference: reference || '',
  };
}

function preprocessMarkdown(fileName, content) {
  if (fileName === 'index.md') {
    const lines = content.split('\n');
    if (lines[0]?.startsWith('# ')) {
      lines.shift();
    }
    return lines.join('\n').trim();
  }
  return content;
}

function markdownToHtml(fileName, content) {
  return md.render(preprocessMarkdown(fileName, content));
}

function extractSummary(content) {
  const lines = content.split('\n').map((line) => line.trim());
  const firstTextLine = lines.find(
    (line) => line && !line.startsWith('#') && !line.startsWith('|')
  );
  if (!firstTextLine) return '';
  return firstTextLine
    .replace(/[*_`]/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();
}

function ensureDir(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  ensureDir(ASSETS_DIST_DIR);
}

function copyAssets() {
  if (!fs.existsSync(ASSETS_SRC_DIR)) return;
  const files = fs.readdirSync(ASSETS_SRC_DIR);
  files.forEach((file) => {
    const src = path.join(ASSETS_SRC_DIR, file);
    const dest = path.join(ASSETS_DIST_DIR, file);
    fs.copyFileSync(src, dest);
  });
}

function renderLayout({
  title,
  description = '',
  content,
  breadcrumbs = [],
  basePath = '.',
}) {
  const breadcrumbHtml = breadcrumbs
    .map((crumb, index) => {
      if (!crumb.href || index === breadcrumbs.length - 1) {
        return `<span>${crumb.label}</span>`;
      }
      return `<a href="${crumb.href}">${crumb.label}</a>`;
    })
    .join('<span class="crumb-sep">/</span>');

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    ${description ? `<meta name="description" content="${description}">` : ''}
    <link rel="stylesheet" href="${basePath}/assets/styles.css">
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <a href="${basePath}/" class="brand">Perso Maquettes</a>
        <nav>
          <a href="${basePath}/">Accueil</a>
          <a href="https://github.com/lutin1675-source/maquettes" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
    </header>
    <main class="container">
      <div class="breadcrumbs">${breadcrumbHtml}</div>
      ${content}
    </main>
    <footer class="site-footer">
      <div class="container">
        <p>Documentation statique générée automatiquement. Prête pour GitHub Pages.</p>
      </div>
    </footer>
  </body>
</html>`;
}

function buildHome(models) {
  const cards = models
    .map((model) => {
      return `<article class="model-card">
        <div>
          <p class="eyebrow">${model.manufacturer || 'Maquette'}</p>
          <h2>${model.modelName}</h2>
          <p class="muted">${model.reference ? `Réf. ${model.reference}` : ''}</p>
          <p>${model.summary || 'Consulter la fiche détaillée pour plus d’informations.'}</p>
        </div>
        <a class="btn" href="./models/${model.slug}/">Voir la fiche</a>
      </article>`;
    })
    .join('\n');

  const hero = `<section class="hero">
    <div>
      <p class="eyebrow">Atelier documentaire</p>
      <h1>Maquettes statiques documentées</h1>
      <p>Chaque fiche compile historique, matériel, visuels et conseils d’assemblage avec des sources vérifiées.</p>
    </div>
    <div class="hero-panel">
      <h2>Déploiement facile</h2>
      <ul>
        <li>Exécuter <code>npm run build</code></li>
        <li>Publier le dossier <code>dist</code> sur GitHub Pages</li>
        <li>Ajouter d’autres maquettes sous <code>/models</code></li>
      </ul>
    </div>
  </section>`;

  const content = `${hero}
    <section>
      <h2>Catalogue</h2>
      <div class="model-grid">
        ${cards}
      </div>
    </section>`;

  const html = renderLayout({
    title: 'Perso Maquettes',
    description: 'Documentation statique pour les maquettes de modèles réduits.',
    breadcrumbs: [{ label: 'Accueil' }],
    basePath: '.',
    content,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html, 'utf8');
}

function buildModelPage(model) {
  const sections = model.docs
    .map((doc) => {
      const sectionId = slugify(doc.title);
      return `<section id="${sectionId}">
        <div class="section-head">
          <h2>${doc.title}</h2>
          <a href="#${sectionId}" aria-label="Lien vers ${doc.title}">#</a>
        </div>
        ${doc.html}
      </section>`;
    })
    .join('\n');

  const header = `<section class="model-hero">
    <div>
      <p class="eyebrow">${model.manufacturer || 'Maquette'}</p>
      <h1>${model.modelName}</h1>
      ${
        model.reference
          ? `<p class="muted">Référence Revell : <strong>${model.reference}</strong></p>`
          : ''
      }
    </div>
    <div>
      <ul class="meta-list">
        <li><span>Slug</span> ${model.slug}</li>
        <li><span>Dossiers</span> ${model.docs.length}</li>
      </ul>
    </div>
  </section>`;

  const navLinks = model.docs
    .map(
      (doc) =>
        `<li><a href="#${slugify(doc.title)}">${doc.title}</a></li>`
    )
    .join('\n');

  const quickNav = `<aside class="local-nav">
    <h2>Sections</h2>
    <ul>${navLinks}</ul>
  </aside>`;

  const content = `${header}${quickNav}${sections}`;

  const html = renderLayout({
    title: `${model.modelName} – ${model.reference || 'Fiche'}`,
    description: model.summary,
    breadcrumbs: [
      { label: 'Accueil', href: '../..' },
      { label: model.modelName },
    ],
    basePath: '../..',
    content,
  });

  const modelDistDir = path.join(DIST_DIR, 'models', model.slug);
  ensureDir(modelDistDir);
  fs.writeFileSync(path.join(modelDistDir, 'index.html'), html, 'utf8');
}

function buildSite() {
  if (!fs.existsSync(MODELS_DIR)) {
    console.error('Le dossier "models" est introuvable.');
    process.exit(1);
  }

  cleanDist();
  copyAssets();

  const folders = fs
    .readdirSync(MODELS_DIR)
    .filter((entry) =>
      fs.statSync(path.join(MODELS_DIR, entry)).isDirectory()
    );

  const models = folders.map((folder) => {
    const modelPath = path.join(MODELS_DIR, folder);
    const meta = parseFolderMeta(folder);
    const slug = slugify(meta.modelName);
    const docs = [];

    DOC_ORDER.forEach((doc) => {
      const filePath = path.join(modelPath, doc.file);
      if (!fs.existsSync(filePath)) return;
      const raw = fs.readFileSync(filePath, 'utf8');
      const html = markdownToHtml(doc.file, raw);
      docs.push({
        title: doc.title,
        html,
        fileName: doc.file,
        raw,
      });
      if (!meta.summary && doc.file === 'index.md') {
        meta.summary = extractSummary(raw);
      }
    });

    return {
      ...meta,
      slug,
      docs,
      summary: meta.summary || '',
    };
  });

  buildHome(models);
  models.forEach(buildModelPage);
  console.log(`Site généré dans ${DIST_DIR}`);
}

buildSite();

import fs from 'node:fs';
import path from 'node:path';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const MODELS_DIR = path.join(process.cwd(), 'models');

const DOC_ORDER = [
  { file: 'index.md', title: 'Synthèse' },
  { file: 'historique.md', title: 'Historique' },
  { file: 'materiel.md', title: 'Matériel' },
  { file: 'visuels.md', title: 'Visuels' },
  { file: 'tips.md', title: 'Conseils' },
];

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseFolderMeta(folderName: string) {
  const matches = [...folderName.matchAll(/\[(.*?)\]/g)].map((match) => match[1]);
  const [modelName, manufacturer, reference] = matches;
  return {
    folderName,
    modelName: modelName || folderName,
    manufacturer: manufacturer || '',
    reference: reference || '',
  };
}

function preprocessMarkdown(fileName: string, content: string) {
  if (fileName === 'index.md') {
    const lines = content.split('\n');
    if (lines[0]?.startsWith('# ')) {
      lines.shift();
    }
    return lines.join('\n').trim();
  }
  return content;
}

function markdownToHtml(fileName: string, content: string) {
  return md.render(preprocessMarkdown(fileName, content));
}

function extractSummary(content: string) {
  const lines = content.split('\n').map((line) => line.trim());
  const firstTextLine = lines.find(
    (line) => line && !line.startsWith('#') && !line.startsWith('|')
  );
  if (!firstTextLine) return '';
  return firstTextLine.replace(/[*_`]/g, '').replace(/\[(.*?)\]\((.*?)\)/g, '$1').trim();
}

export type ModelSection = {
  title: string;
  html: string;
  fileName: string;
  raw: string;
};

export type ModelEntry = {
  slug: string;
  modelName: string;
  manufacturer: string;
  reference: string;
  summary: string;
  docs: ModelSection[];
};

let cache: ModelEntry[] | null = null;

function loadModelsFromDisk(): ModelEntry[] {
  if (!fs.existsSync(MODELS_DIR)) return [];

  const folders = fs
    .readdirSync(MODELS_DIR)
    .filter((entry) => fs.statSync(path.join(MODELS_DIR, entry)).isDirectory());

  return folders.map((folder) => {
    const modelPath = path.join(MODELS_DIR, folder);
    const meta = parseFolderMeta(folder);
    const slug = slugifyText(meta.modelName);
    const docs: ModelSection[] = [];
    let summary = '';

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
      if (!summary && doc.file === 'index.md') {
        summary = extractSummary(raw);
      }
    });

    return {
      slug,
      modelName: meta.modelName,
      manufacturer: meta.manufacturer,
      reference: meta.reference,
      summary,
      docs,
    };
  });
}

export function getAllModels(): ModelEntry[] {
  if (!cache) {
    cache = loadModelsFromDisk();
  }
  return cache;
}

export function getModelBySlug(slug: string) {
  return getAllModels().find((model) => model.slug === slug);
}

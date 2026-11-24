// Generates the social card, static/img/og-<slug>.png, from project.json.
//
//   npm run og-image
//
// The card is 1200x630: a purple band with the project name, the headline,
// the feature row and a provenance line, above the shared Vela banner. Every
// Vela Tools documentation site renders it from this script, so the cards
// stay identical apart from their text. Rerun it whenever name, headline,
// features or kind change in project.json, and commit the PNG.
//
// The fonts are fetched from the google/fonts repository on the first run and
// cached under node_modules/.cache, so no font file is stored in the
// repository (see NOTICE.md).

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = join(root, 'node_modules', '.cache', 'og-image');

const fonts = {
  'Audiowide-Regular.ttf':
    'https://raw.githubusercontent.com/google/fonts/main/ofl/audiowide/Audiowide-Regular.ttf',
  'Roboto.ttf':
    'https://raw.githubusercontent.com/google/fonts/main/ofl/roboto/Roboto%5Bwdth%2Cwght%5D.ttf',
};

// Layout, in pixels of the 1200x630 card.
const W = 1200;
const H = 630;
const BAND = 336;
const X = 73;
// The headline at this size fills the band's width at about 65 characters.
const MAX_HEADLINE = 65;
const MAX_FEATURES = 85;

async function fetchFonts() {
  await mkdir(cacheDir, { recursive: true });
  const paths = [];
  for (const [name, url] of Object.entries(fonts)) {
    const path = join(cacheDir, name);
    try {
      await access(path);
    } catch {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
      await writeFile(path, Buffer.from(await res.arrayBuffer()));
    }
    paths.push(path);
  }
  return paths;
}

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function check(project) {
  const unfilled = ['name', 'slug', 'kind', 'headline']
    .concat(project.features.map((_, i) => `features[${i}]`))
    .filter((key) => {
      const value = key.startsWith('features')
        ? project.features[Number(key.slice(9, -1))]
        : project[key];
      return /\{\{[A-Z_]+/.test(value);
    });
  if (unfilled.length) {
    throw new Error(`fill these in project.json first: ${unfilled.join(', ')}`);
  }
  const features = project.features.join(' · ');
  if (project.headline.length > MAX_HEADLINE) {
    console.warn(
      `warning: headline is ${project.headline.length} characters; over ${MAX_HEADLINE} it may run off the card`,
    );
  }
  if (features.length > MAX_FEATURES) {
    console.warn(
      `warning: feature row is ${features.length} characters; over ${MAX_FEATURES} it may run off the card`,
    );
  }
}

function svg(project, banner) {
  const dot = '<tspan dx="12" dy="0">·</tspan><tspan dx="12">';
  const row = (items) =>
    items.map(escape).join(`</tspan>${dot}`).replace(/^/, '<tspan>') + '</tspan>';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="band" x1="0" y1="0" x2="0" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5729a6"/>
      <stop offset="1" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#fff"/>
  <rect width="${W}" height="${BAND}" fill="url(#band)"/>
  <text x="${X}" y="112" font-family="Audiowide" font-size="67" fill="#fff">${escape(project.name)}</text>
  <text x="${X}" y="189" font-family="Roboto" font-size="36" fill="#fff" fill-opacity="0.95">${escape(project.headline)}</text>
  <text x="${X}" y="244" font-family="Roboto" font-size="24" fill="#fff" fill-opacity="0.85">${row(project.features)}</text>
  <text x="${X}" y="300" font-family="Roboto" font-size="22" fill="#fff" fill-opacity="0.7">${row([`Open source ${project.kind}`, 'EUPL-1.2', 'Vela Tools'])}</text>
  <svg x="250" y="362" width="700" height="240" viewBox="0 0 7000 2400" preserveAspectRatio="xMidYMid meet">${banner}</svg>
</svg>`;
}

const { project } = JSON.parse(
  await readFile(join(root, 'project.json'), 'utf8'),
);
check(project);

// Inline the banner's children so it renders as part of one document.
const bannerSource = await readFile(join(root, 'static/img/vela-banner.svg'), 'utf8');
const banner = bannerSource.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');

const fontFiles = await fetchFonts();
const png = new Resvg(svg(project, banner), {
  font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Roboto' },
  fitTo: { mode: 'original' },
})
  .render()
  .asPng();

const out = join(root, 'static/img', `og-${project.slug}.png`);
await writeFile(out, png);
console.log(`wrote ${out}`);

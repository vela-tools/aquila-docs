// Fills the template from project.json. Run once, after filling project.json:
//
//   npm run setup
//
// The site's code reads project.json at build time, so a later change to it
// needs no rerun. This script handles the files that cannot read it: the
// README, NOTICE, CONTRIBUTING, the issue forms, robots.txt and the starter
// pages. A marker in them is the upper-case path of a value in project.json,
// so {{PROJECT_NAME}} is project.name and {{ISSUES_GOAL_INPUTS}} is
// issues.goalInputs. It also:
//
// - moves readme-template.md over README.md, replacing the template's guide,
// - names the package <slug>-docs,
// - renames the starting version to docs.firstVersion.
//
// It refuses to run while project.json still holds a placeholder, and it ends
// by listing every marker left, such as the {{WRITE: ...}} prose in the
// starter pages, exiting non-zero until there are none. Running it again is
// safe, so it doubles as the pre-publication check.

import { existsSync } from 'node:fs';
import { readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MARKER = /\{\{([A-Z_]+)(?::[^}]*)?\}\}/g;
const PLACEHOLDER = /\{\{[A-Z_]+/;
const TEXT = new Set(['.md', '.mdx', '.yaml', '.yml', '.txt']);
const SKIP = new Set(['node_modules', '.git', 'build', '.docusaurus']);

const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'));
const writeJson = (path, value) =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`);

// project.name -> PROJECT_NAME, issues.goalInputs -> ISSUES_GOAL_INPUTS.
// Arrays and null are read by the code only and get no marker.
function flatten(value, path = [], out = new Map()) {
  if (typeof value === 'string' || typeof value === 'number') {
    const key = path
      .map((p) => p.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase())
      .join('_');
    out.set(key, String(value));
  } else if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value)) flatten(v, [...path, k], out);
  }
  return out;
}

function unfilled(value, path = '') {
  if (typeof value === 'string') return PLACEHOLDER.test(value) ? [path] : [];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) =>
      unfilled(v, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

async function* textFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* textFiles(path);
    else if (TEXT.has(extname(entry.name))) yield path;
  }
}

const config = await readJson(join(root, 'project.json'));

const missing = unfilled(config);
if (missing.length) {
  console.error('Fill these in project.json first:');
  for (const path of missing) console.error(`  ${path}`);
  process.exit(1);
}
const { slug } = config.project;
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`project.slug must be a lower-case repository name, not "${slug}"`);
  process.exit(1);
}

// The starting version. Only a fresh template, with one version, is renamed.
const versionsPath = join(root, 'versions.json');
const versions = await readJson(versionsPath);
const first = config.docs.firstVersion;
if (versions.length === 1 && versions[0] !== first) {
  const from = versions[0];
  await rename(
    join(root, 'versioned_docs', `version-${from}`),
    join(root, 'versioned_docs', `version-${first}`),
  );
  await rename(
    join(root, 'versioned_sidebars', `version-${from}-sidebars.json`),
    join(root, 'versioned_sidebars', `version-${first}-sidebars.json`),
  );
  await writeJson(versionsPath, [first]);
  console.log(`renamed version ${from} to ${first}`);
}

const readmeTemplate = join(root, 'readme-template.md');
if (existsSync(readmeTemplate)) {
  await rename(readmeTemplate, join(root, 'README.md'));
  console.log('moved readme-template.md to README.md');
}

const pkgPath = join(root, 'package.json');
const pkg = await readJson(pkgPath);
if (pkg.name !== `${slug}-docs`) {
  pkg.name = `${slug}-docs`;
  await writeJson(pkgPath, pkg);
  console.log(`named the package ${pkg.name}`);
}

const values = flatten(config);
const left = [];
for await (const path of textFiles(root)) {
  const text = await readFile(path, 'utf8');
  const filled = text.replace(MARKER, (marker, key) =>
    values.has(key) ? values.get(key) : marker,
  );
  if (filled !== text) {
    await writeFile(path, filled);
    console.log(`filled ${relative(root, path)}`);
  }
  filled.split('\n').forEach((line, i) => {
    for (const [marker] of line.matchAll(MARKER)) {
      left.push(`  ${relative(root, path)}:${i + 1}: ${marker}`);
    }
  });
}

if (left.length) {
  console.error('\nStill to write by hand:');
  for (const line of left) console.error(line);
  process.exit(1);
}
console.log('\nNo placeholders left. Next: npm run og-image');

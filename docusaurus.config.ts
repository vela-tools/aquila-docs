import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Everything that differs between Vela Tools documentation sites lives in
// project.json. This file reads it and is otherwise identical in every site.
import site from './project.json';
// Newest first. The first entry is the default version, served at /docs.
import versions from './versions.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const { project } = site;

const siteUrl = 'https://vela-tools.github.io';
const baseUrl = `/${project.slug}/`;
const siteHome = `${siteUrl}${baseUrl}`;
const asset = (path: string) => `${siteHome}${path}`;
const repoUrl = `https://github.com/vela-tools/${project.slug}`;
const ogImage = `img/og-${project.slug}.png`;

const [latestVersion, ...archivedVersions] = versions;

// Search keywords, used as the default <meta name="keywords"> and as the
// fallback for pages that declare none of their own. NGSI-LD, FIWARE and the
// broker names are the terms people actually search for; the project adds its
// own in project.json.
const siteKeywords = [
  'NGSI-LD',
  project.kind,
  ...project.keywords,
  'ETSI GS CIM 009',
  'context broker',
  'FIWARE',
  'Scorpio',
  'linked data',
  'dataspace',
  'open source',
  'EUPL-1.2',
];

// Site-level JSON-LD. Docusaurus already emits a BreadcrumbList on every doc
// page and src/theme/DocItem/Metadata adds a TechArticle, so this graph only
// carries the three nodes that describe the publisher, the site, and the
// software itself. Kept as one @graph so the nodes can reference each other by
// @id instead of repeating themselves.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteHome}#organization`,
      name: 'Vela Tools',
      legalName: 'SenLab d.o.o.',
      url: 'https://velacontext.com',
      logo: {
        '@type': 'ImageObject',
        url: asset('img/vela.png'),
        width: 512,
        height: 512,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ljubljana',
        addressCountry: 'SI',
      },
      sameAs: ['https://github.com/vela-tools', 'https://velacontext.com'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteHome}#website`,
      url: siteHome,
      name: `${project.name} documentation`,
      description: project.tagline,
      inLanguage: 'en',
      publisher: { '@id': `${siteHome}#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteHome}#software`,
      name: project.name,
      alternateName: `${project.name} ${project.kind}`,
      applicationCategory: project.applicationCategory,
      description: project.description,
      // Left out while empty, for a project that has not settled them yet.
      ...(project.operatingSystem
        ? { operatingSystem: project.operatingSystem }
        : {}),
      ...(project.programmingLanguage
        ? { programmingLanguage: project.programmingLanguage }
        : {}),
      url: siteHome,
      image: asset(ogImage),
      downloadUrl: `${repoUrl}/releases/latest`,
      softwareHelp: { '@id': `${siteHome}#website` },
      license: 'https://eupl.eu/1.2/en/',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
      },
      author: { '@id': `${siteHome}#organization` },
      publisher: { '@id': `${siteHome}#organization` },
    },
  ],
};

const config: Config = {
  title: project.name,
  tagline: project.tagline,
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: siteUrl,
  baseUrl,

  organizationName: 'vela-tools',
  projectName: project.slug,

  // A link into a page that does not exist stops the build rather than
  // warning, so CI is also the internal link check.
  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // The three webfonts used to be @import-ed from custom.scss, which chains
  // them behind the bundled stylesheet and delays first paint. Loading them
  // from <head> with a preconnect starts the handshake immediately instead.
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://iosevka-webfonts.github.io',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Audiowide&display=swap',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://iosevka-webfonts.github.io/iosevka/Iosevka.css',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: `${baseUrl}img/apple-touch-icon.png`,
      },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify(structuredData),
    },
  ],

  plugins: [
    'docusaurus-plugin-sass',
    [
      'docusaurus-plugin-llms',
      {
        // The docs are versioned with no current version, so point the plugin
        // straight at the newest published version, the one served at /docs,
        // instead of the default `docs/` directory, which does not exist here.
        docsDir: [
          {
            path: `versioned_docs/version-${latestVersion}`,
            routeBasePath: 'docs',
          },
        ],
        title: project.name,
        description: project.tagline,
        version: latestVersion,
        rootContent: project.description,
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        keepFrontMatter: ['title', 'description'],
        excludeImports: true,
        removeDuplicateHeadings: true,
        // Add includeOrder here, in sidebar order, once the version has more
        // than a few pages, so llms-full.txt reads like the site rather than
        // alphabetically.
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          // Docs live under /docs so the React landing page can own '/'.
          routeBasePath: '/docs',
          // Versioned only, no unversioned `docs/` current version: edits go
          // straight into versioned_docs/version-<v> and each sidebar lives in
          // versioned_sidebars/version-<v>-sidebars.json. The newest entry in
          // versions.json is the default and is served at /docs. To cut the
          // next release, copy both and add the version to the top of
          // versions.json; `docusaurus docs:version` needs a current version
          // and won't work.
          includeCurrentVersion: false,
          // Only the newest version is indexable. An archived version repeats
          // the current one almost word for word, down to the title and the
          // description, so leaving them all open puts several URLs in front
          // of a search engine for one query and lets it pick. noIndex keeps
          // the pages reachable for anyone pinned to an older release while
          // taking them out of that contest; the matching sitemap exclusion
          // below stops the site advertising URLs it asks not to be indexed.
          versions: Object.fromEntries(
            versions.map((v) => [
              v,
              v === latestVersion
                ? { label: `v${v}` }
                : { label: `v${v}`, noIndex: true },
            ]),
          ),
          // Feeds the sitemap's <lastmod> from git and shows a freshness date
          // at the foot of each page.
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.scss',
        },
        sitemap: {
          // Google ignores changefreq and priority outright, and reads lastmod
          // only when it is honest; showLastUpdateTime above makes it so.
          changefreq: null,
          priority: null,
          lastmod: 'date',
          // Archived versions are noIndex (see the versions map above), so
          // listing them here would ask a crawler to fetch what it is then
          // told to drop.
          ignorePatterns: [
            '**/search',
            '**/tags/**',
            ...archivedVersions.map((v) => `/docs/${v}/**`),
          ],
        },
      } satisfies Preset.Options,
    ],
  ],

  markdown: {
    mermaid: true,
    // Parse .md as CommonMark, so `{{ }}`, `<Type>` and `#` comments in prose
    // need no escaping; .mdx files still get full MDX for pages that import
    // components.
    format: 'detect',
  },
  themes: ['@docusaurus/theme-mermaid'],

  themeConfig: {
    // Default social card, generated by `npm run og-image`. Pages can override
    // it with an `image` front-matter field.
    image: ogImage,
    metadata: [
      { name: 'keywords', content: siteKeywords.join(', ') },
      { name: 'author', content: 'SenLab d.o.o.' },
      { name: 'theme-color', content: '#7c3aed' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: project.name },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content: `${project.name}: ${project.headline}`,
      },
      {
        name: 'twitter:image:alt',
        content: `${project.name} ${project.kind}`,
      },
    ],
    colorMode: {
      defaultMode: 'light',
    },
    navbar: {
      title: project.name,
      logo: {
        alt: 'Vela logo',
        src: 'img/vela-context-light.webp',
        srcDark: 'img/vela-context-dark.webp',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'right',
          label: 'Documentation',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: repoUrl,
          className: 'navbar-github-link',
          'aria-label': `${project.name} on GitHub`,
          title: `${project.name} on GitHub`,
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      // Simple footer: an icon row and the copyright line, no link columns.
      // Add an icon here for a project-specific companion, such as an
      // examples repository, using the same 22px stroke style.
      copyright: `
        <div class="footer-icons">
                  <a href="${repoUrl}" target="_blank" rel="noopener noreferrer" title="${project.name} on GitHub" aria-label="${project.name} on GitHub">
                    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
                  </a>
                  <a href="${repoUrl}/pkgs/container/${project.slug}" target="_blank" rel="noopener noreferrer" title="Container image on GHCR" aria-label="Container image on GHCR">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.6 20.5 7v10L12 21.4 3.5 17V7z"/><path d="M3.5 7 12 11.5 20.5 7M12 11.5v9.9"/></svg>
                  </a>
                  <a href="${project.productPage}" target="_blank" rel="noopener noreferrer" title="${project.name} on Vela Context" aria-label="${project.name} on Vela Context">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 2.8c2.4 2.5 3.7 5.6 3.7 9.2s-1.3 6.7-3.7 9.2c-2.4-2.5-3.7-5.6-3.7-9.2s1.3-6.7 3.7-9.2Z"/><path d="M3 12h18"/></svg>
                  </a>
        </div>
        <div class="footer-provenance">
          Part of <a href="https://github.com/vela-tools">Vela Tools</a>
          · Based on EU open standards 🇪🇺
          · Built in Ljubljana, Slovenia 🇸🇮
        </div>
        <div class="footer-legal">
          Copyright © ${new Date().getFullYear()} SenLab d.o.o.
          ${project.name} is licensed under the <a href="https://eupl.eu/">EUPL-1.2</a>.
        </div>
      `,
    },
    prism: {
      // github's keyword purple is #6f42c1 (hue 261) against the brand's 262;
      // duotoneDark is purple-duotone throughout, background hue 254.
      theme: prismThemes.github,
      darkTheme: prismThemes.duotoneDark,
      additionalLanguages: ['bash', 'diff', 'http', 'json', 'json5', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

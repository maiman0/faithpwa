#!/usr/bin/env node
'use strict';

// Expo Router's web `+html.tsx` customization (manifest link, apple-touch-icon,
// PWA meta tags, viewport-fit=cover) only applies when web.output is "static".
// This app uses the default "single" (classic SPA) output, so the exported
// dist/index.html comes from Expo's generic template instead and ships
// without any of that. This script patches the exported HTML directly, post-export,
// so production installs get the tags without switching output modes (which
// would require prerendering every route — too risky for this app's heavy
// reliance on client-only state).

const fs = require('fs');
const path = require('path');

const target = process.argv[2] || path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(target)) {
  console.error(`inject-pwa-meta: ${target} not found`);
  process.exit(1);
}

let html = fs.readFileSync(target, 'utf8');

if (html.includes('rel="manifest"')) {
  console.log('inject-pwa-meta: manifest link already present, skipping');
  process.exit(0);
}

html = html.replace(
  /<meta name="viewport" content="[^"]*"\s*\/>/,
  '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />',
);

const pwaTags = [
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  '<meta name="apple-mobile-web-app-title" content="Our Companion" />',
  '<link rel="manifest" href="/manifest.json" />',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png" />',
].join('\n');

html = html.replace('</head>', `${pwaTags}\n</head>`);

fs.writeFileSync(target, html);
console.log(`inject-pwa-meta: patched ${target}`);

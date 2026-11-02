import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const ts = require('typescript')
const slugs = []
const layoutNames = [
  'editorial', 'wheel', 'poster', 'reverse', 'technical', 'industrial', 'studio', 'minimal', 'split',
  'wheel', 'poster', 'corporate', 'utility', 'stacked', 'editorial', 'profile', 'reverse', 'split',
  'wheel', 'technical', 'stacked', 'industrial', 'minimal', 'poster', 'reverse', 'industrial', 'split',
]
const appRuntimeDependencies = { 'lucide-react': '^0.468.0', react: '^18.3.1', 'react-dom': '^18.3.1' }
const appDevelopmentDependencies = {
  '@types/react': '^18.3.12',
  '@types/react-dom': '^18.3.1',
  '@vitejs/plugin-react': '^4.3.4',
  autoprefixer: '^10.4.20',
  postcss: '^8.4.49',
  tailwindcss: '^3.4.17',
  typescript: '~5.7.2',
  vite: '^6.0.5',
}
const appDependencies = { dependencies: appRuntimeDependencies, devDependencies: appDevelopmentDependencies }

function readBusinesses() {
  const source = fs.readFileSync(path.join(root, 'src/demoData.ts'), 'utf8')
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const mod = { exports: {} }
  new Function('exports', 'require', 'module', js)(mod.exports, require, mod)
  return mod.exports.demos
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content, 'utf8')
}

function favicon(letter, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#101820"/><path fill="${color}" d="M0 52h64v12H0z"/><text x="32" y="43" fill="#f4f1e9" font-family="Arial,sans-serif" font-size="38" font-weight="700" text-anchor="middle">${letter.replace(/[<&>]/g, '')}</text></svg>`
}

const businesses = readBusinesses()
if (!Array.isArray(businesses) || businesses.length !== 27) throw new Error(`Expected 27 business records, got ${businesses?.length}`)
const duplicateSlugs = businesses.map(item => item.slug).filter((slug, index, all) => all.indexOf(slug) !== index)
if (duplicateSlugs.length) throw new Error(`Duplicate slug(s): ${duplicateSlugs.join(', ')}`)
for (const target of ['garage', 'sites']) {
  if (fs.existsSync(path.join(root, target))) throw new Error(`Refusing to overwrite existing ${target}/ directory`)
}

fs.mkdirSync(path.join(root, 'garage/src'), { recursive: true })
fs.mkdirSync(path.join(root, 'garage/public'), { recursive: true })
for (const file of ['src/App.tsx', 'src/style.css']) fs.copyFileSync(path.join(root, file), path.join(root, 'garage', file.replace('src/', 'src/')))
fs.copyFileSync(path.join(root, 'index.html'), path.join(root, 'garage/index.html'))
write(path.join(root, 'garage/src/main.tsx'), "import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport App from './App'\nimport './style.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)\n")
  write(path.join(root, 'garage/vite.config.ts'), "import path from 'node:path'\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ root: process.cwd(), server: { fs: { allow: [path.resolve(process.cwd(), '..')] } }, optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'lucide-react'] }, plugins: [react()], build: { outDir: 'dist', emptyOutDir: true } })\n")
fs.copyFileSync(path.join(root, 'public/_redirects'), path.join(root, 'garage/public/_redirects'))
write(path.join(root, 'garage/public/favicon.svg'), favicon('G', '#f0df17'))
write(path.join(root, 'garage/netlify.toml'), '[build]\ncommand = "npm run build --workspace=@auto-premium/garage"\npublish = "garage/dist"\n\n[build.environment]\nNODE_VERSION = "20"\n')
write(path.join(root, 'garage/package.json'), JSON.stringify({ name: '@auto-premium/garage', private: true, version: '1.0.0', type: 'module', ...appDependencies, scripts: { dev: 'vite --configLoader runner --config vite.config.ts --host 0.0.0.0', build: 'tsc --noEmit -p tsconfig.json && vite build --configLoader runner --config vite.config.ts', preview: 'vite preview --configLoader runner --config vite.config.ts --host 0.0.0.0' } }, null, 2) + '\n')
write(path.join(root, 'garage/tsconfig.json'), JSON.stringify({ extends: '../tsconfig.app.json', include: ['src'], compilerOptions: { tsBuildInfoFile: './node_modules/.tmp/garage.tsbuildinfo' } }, null, 2) + '\n')

const rootPackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
rootPackage.workspaces = ['garage', 'sites/*']
rootPackage.scripts = {
  ...rootPackage.scripts,
  'build:all-sites': 'npm run build --workspaces --if-present',
  'verify:sites': 'node scripts/verify-sites.mjs',
}

businesses.forEach((business, index) => {
  const slug = business.slug
  slugs.push(slug)
  const siteRoot = path.join(root, 'sites', slug)
  if (fs.existsSync(siteRoot)) throw new Error(`Refusing to overwrite existing ${path.relative(root, siteRoot)}/`)
  const layout = layoutNames[index]
  const data = { ...business, layout }
  const title = `${business.name} — ${business.category} · демонстрационная концепция`
  const description = `${business.name}: ${business.description} Демонстрационная концепция сайта.`
  const pkgName = `@auto-premium/${slug}`
  write(path.join(siteRoot, 'index.html'), `<!doctype html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n  <meta name="theme-color" content="${business.background}" />\n  <meta name="description" content="${description.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" />\n  <meta name="robots" content="noindex, nofollow" />\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />\n  <title>${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>\n`)
  write(path.join(siteRoot, 'src/main.tsx'), `import React from 'react'\nimport ReactDOM from 'react-dom/client'\nimport BusinessSite from '../../../shared/BusinessSite'\nimport { business } from '../business'\nimport './site.css'\n\nReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><BusinessSite demo={business} /></React.StrictMode>)\n`)
  write(path.join(siteRoot, 'business.ts'), `import type { BusinessData } from '../../shared/types'\n\nexport const business: BusinessData = ${JSON.stringify(data, null, 2)}\n`)
  const minHeight = 570 + (index % 6) * 22
  const discRadius = layout === 'industrial' || layout === 'technical' ? '12%' : layout === 'studio' ? '8%' : '50%'
  const siteCss = `/* Local visual direction for ${business.name}; edit this file without affecting other workspaces. */\n.business-site.site-${slug} .business-header { border-bottom-color: color-mix(in srgb, var(--accent) 24%, transparent); }\n@media (min-width: 761px) {\n  .business-site.site-${slug} .business-hero { min-height: ${minHeight}px; }\n  .business-site.site-${slug} .hero-visual { min-height: ${minHeight}px; }\n  .business-site.site-${slug} .visual-disc { border-radius: ${discRadius}; transform: rotate(${index * 3 - 32}deg); }\n  .business-site.site-${slug} .service-tile:nth-child(${(index % 3) + 1}) { border-top: 2px solid var(--accent); }\n}`
  write(path.join(siteRoot, 'src/site.css'), siteCss)
  write(path.join(siteRoot, 'vite.config.ts'), `import path from 'node:path'\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({ root: process.cwd(), server: { fs: { allow: [path.resolve(process.cwd(), '../..')] } }, optimizeDeps: { noDiscovery: true, include: ['react', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'lucide-react'] }, plugins: [react()], build: { outDir: 'dist', emptyOutDir: true } })\n`)
  write(path.join(siteRoot, 'tsconfig.json'), JSON.stringify({ extends: '../../tsconfig.app.json', include: ['src', '../../shared'], compilerOptions: { tsBuildInfoFile: `./node_modules/.tmp/${slug}.tsbuildinfo` } }, null, 2) + '\n')
  write(path.join(siteRoot, 'package.json'), JSON.stringify({ name: pkgName, private: true, version: '1.0.0', type: 'module', ...appDependencies, scripts: { dev: 'vite --configLoader runner --config vite.config.ts --host 0.0.0.0', build: 'tsc --noEmit -p tsconfig.json && vite build --configLoader runner --config vite.config.ts', preview: 'vite preview --configLoader runner --config vite.config.ts --host 0.0.0.0' } }, null, 2) + '\n')
  write(path.join(siteRoot, 'netlify.toml'), `[build]\ncommand = "npm run build --workspace=${pkgName}"\npublish = "sites/${slug}/dist"\n`)
  write(path.join(siteRoot, 'public/_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n')
  write(path.join(siteRoot, 'public/favicon.svg'), favicon(business.name.slice(0, 1), business.accent))
})

write(path.join(root, 'package.json'), JSON.stringify(rootPackage, null, 2) + '\n')
const readme = [
  "# Auto Premium websites",
  "",
  "The original Garage showcase remains at the repository root. The monorepo also provides an independent garage/ app and one independent Vite app per business under sites/. Each workspace has its own entry point, data, local CSS, Vite configuration, build output, SEO metadata, favicon, and Netlify configuration.",
  "",
  "## Build and run",
  "",
  "Run an app from the repository root with npm workspace commands:",
  "",
  "```sh",
  "npm run dev --workspace=@auto-premium/mobishin22",
  "npm run build --workspace=@auto-premium/mobishin22",
  "npm run dev --workspace=@auto-premium/garage",
  "npm run build --workspace=@auto-premium/garage",
  "npm run build:all-sites",
  "npm run verify:sites",
  "```",
  "",
  "Replace mobishin22 with any workspace below. Each build writes only to its own dist/. The root npm run build continues to build the legacy showcase independently.",
  "",
  "## Independent Netlify deployment",
  "",
  "Create one Netlify site per workspace. Choose the detected app folder, or set Package directory to sites/mobishin22 and leave Base directory unset so npm runs from the repository root. Netlify then reads that package's netlify.toml, runs only its workspace build, and publishes sites/mobishin22/dist. Use package directory garage for Garage. After deploy, add the owned domain in that site's Domain management. Demo apps ship with noindex, nofollow in HTML and response headers; remove those only after the owner approves publication.",
  "",
  "## Sites",
  "",
  ...businesses.map(item => "- sites/" + item.slug + " - " + item.name),
  "",
]
write(path.join(root, "README.md"), readme.join("\n"))
write(path.join(root, '.gitignore'), `${fs.readFileSync(path.join(root, '.gitignore'), 'utf8').replace(/\s*$/, '')}\n/sites/*/dist/\n/garage/dist/\n`)

console.log(`Created independent Garage + ${slugs.length} business workspaces: ${slugs.join(', ')}`)

import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
const ts = require('typescript')
const viteBin = path.join(root, 'node_modules/vite/bin/vite.js')
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(root, 'node_modules/.cache/ms-playwright')
const { chromium } = await import('@playwright/test')

function evalTypescript(file) {
  const source = fs.readFileSync(file, 'utf8')
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  const mod = { exports: {} }
  new Function('exports', 'require', 'module', js)(mod.exports, require, mod)
  return mod.exports
}

function waitForServer(child, url, slug) {
  return new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => reject(new Error(`${slug}: preview server did not start. ${output}`)), 20_000)
    child.stdout.on('data', chunk => { output += chunk.toString() })
    child.stderr.on('data', chunk => { output += chunk.toString() })
    child.on('exit', code => {
      clearTimeout(timeout)
      reject(new Error(`${slug}: preview server exited (${code}). ${output}`))
    })
    const poll = async () => {
      try {
        const response = await fetch(url)
        if (response.ok) {
          clearTimeout(timeout)
          resolve()
          return
        }
      } catch {}
      if (Date.now() < deadline) setTimeout(poll, 200)
    }
    const deadline = Date.now() + 20_000
    poll()
  })
}

const sourceBusinesses = evalTypescript(path.join(root, 'src/demoData.ts')).demos
if (!Array.isArray(sourceBusinesses) || sourceBusinesses.length !== 27) throw new Error('The source data must contain exactly 27 businesses')
const browser = await chromium.launch()
try {
  for (let index = 0; index < sourceBusinesses.length; index++) {
    const expected = sourceBusinesses[index]
    const siteRoot = path.join(root, 'sites', expected.slug)
    const packageJson = JSON.parse(fs.readFileSync(path.join(siteRoot, 'package.json'), 'utf8'))
    const appData = evalTypescript(path.join(siteRoot, 'business.ts')).business
    if (appData.slug !== expected.slug || appData.name !== expected.name) throw new Error(`${expected.slug}: local business data does not match the source list`)
    if (JSON.stringify(appData.phones) !== JSON.stringify(expected.phones) || JSON.stringify(appData.services) !== JSON.stringify(expected.services)) throw new Error(`${expected.slug}: a phone or service entry changed during migration`)
    const output = path.join(siteRoot, 'dist/index.html')
    if (!fs.existsSync(output)) throw new Error(`${expected.slug}: build output is missing; run npm run build:all-sites first`)
    const html = fs.readFileSync(output, 'utf8')
    if (!html.includes('noindex, nofollow') || !html.includes(expected.name)) throw new Error(`${expected.slug}: SEO metadata or noindex is missing`)
    const headers = fs.readFileSync(path.join(siteRoot, 'dist/_headers'), 'utf8')
    if (!headers.includes('X-Robots-Tag: noindex, nofollow')) throw new Error(`${expected.slug}: Netlify noindex response header is missing`)
    if (packageJson.name !== `@auto-premium/${expected.slug}`) throw new Error(`${expected.slug}: workspace package name is incorrect`)

    const port = 5400 + index
    const url = `http://127.0.0.1:${port}`
    const preview = spawn(process.execPath, [viteBin, 'preview', '--configLoader', 'runner', '--config', 'vite.config.ts', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: siteRoot, stdio: ['ignore', 'pipe', 'pipe'] })
    const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
      page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`) })
    try {
      await waitForServer(preview, url, expected.slug)
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
      if (!response?.ok()) throw new Error(`${expected.slug}: root route failed (${response?.status()})`)
      await page.locator('.business-site').waitFor()
      await page.waitForFunction(() => document.styleSheets.length > 0)
      if (!(await page.title()).includes(expected.name)) throw new Error(`${expected.slug}: title does not identify the business`)
      const contactLinks = await page.locator('#contacts a[href^="tel:"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))
      const expectedLinks = (expected.phones ?? []).map(phone => phone.href)
      if (JSON.stringify(contactLinks) !== JSON.stringify(expectedLinks)) throw new Error(`${expected.slug}: telephone links differ from source data`)
      await page.locator('.hero-secondary').click()
      if (!['#services', '#approach'].includes(new URL(page.url()).hash)) throw new Error(`${expected.slug}: secondary hero navigation did not reach its section`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => document.styleSheets.length > 0)
      await page.locator('.business-menu').click()
      await page.locator('.business-nav.opened').waitFor()
      await page.locator('.business-nav.opened a').first().click()
      if (new URL(page.url()).hash !== '#approach') throw new Error(`${expected.slug}: mobile navigation did not reach the approach section`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => document.styleSheets.length > 0)
      await page.locator('.business-site').waitFor()
      if (!(await page.title()).includes(expected.name)) throw new Error(`${expected.slug}: direct refresh lost its business title`)
      const broken = await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).length)
      if (broken) throw new Error(`${expected.slug}: ${broken} broken image(s)`)
      const localLinks = await page.locator('a[href]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href && !href.startsWith('#') && !href.startsWith('tel:')))
      if (localLinks.length) throw new Error(`${expected.slug}: unexpected cross-site links: ${localLinks.join(', ')}`)
      for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
        await page.setViewportSize(viewport)
        const layout = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
        if (layout.scroll > layout.width) throw new Error(`${expected.slug}: horizontal overflow at ${viewport.width}px`)
      }
      if (errors.length) throw new Error(`${expected.slug}: JavaScript errors: ${errors.join('; ')}`)
      console.log(`PASS ${expected.slug}: independent build output, direct root route, title, tel links, no cross-site links, 375/390/1440px`)
    } finally {
      await page.close()
      preview.kill()
    }
  }

  const garageRoot = path.join(root, 'garage')
  for (const file of ['src/App.tsx', 'src/style.css']) {
    if (fs.readFileSync(path.join(root, file), 'utf8') !== fs.readFileSync(path.join(garageRoot, file), 'utf8')) throw new Error(`Garage copy differs from the original ${file}`)
  }
  const garageIndex = fs.readFileSync(path.join(garageRoot, 'dist/index.html'), 'utf8')
  if (!garageIndex.includes('/favicon.svg')) throw new Error('Garage favicon is not linked from its page')
  const garagePort = 5527
  const garageUrl = `http://127.0.0.1:${garagePort}`
  const garagePreview = spawn(process.execPath, [viteBin, 'preview', '--configLoader', 'runner', '--config', 'vite.config.ts', '--host', '127.0.0.1', '--port', String(garagePort), '--strictPort'], { cwd: garageRoot, stdio: ['ignore', 'pipe', 'pipe'] })
  const garagePage = await browser.newPage({ viewport: { width: 375, height: 812 } })
  const garageErrors = []
  garagePage.on('pageerror', error => garageErrors.push(error.message))
  garagePage.on('console', message => { if (message.type() === 'error') garageErrors.push(`console: ${message.text()}`) })
  try {
    await waitForServer(garagePreview, garageUrl, 'garage')
    await garagePage.goto(garageUrl, { waitUntil: 'domcontentloaded' })
    await garagePage.getByRole('heading', { level: 1 }).waitFor()
    await garagePage.waitForFunction(() => document.styleSheets.length > 0)
    await garagePage.locator('.header-cta').click()
    await garagePage.locator('.toast').waitFor()
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
      await garagePage.setViewportSize(viewport)
      const size = await garagePage.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
      if (size.scroll > size.width) throw new Error(`garage: horizontal overflow at ${viewport.width}px`)
    }
    if (garageErrors.length) throw new Error(`garage: JavaScript errors: ${garageErrors.join('; ')}`)
    console.log('PASS garage: source and CSS preserved, independent build, booking interaction, 375/390/1440px')
  } finally {
    await garagePage.close()
    garagePreview.kill()
  }
} finally {
  await browser.close()
}

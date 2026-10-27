import { expect, test } from '@playwright/test'

const widths = [320, 360, 375, 390, 430, 768, 1024, 1280, 1920]

test('main page content, navigation targets, and links are present', async ({ page }, testInfo) => {
  const issues: string[] = []
  const externalResourceIssues: string[] = []
  const ownOrigin = 'http://127.0.0.1:4173'
  page.on('pageerror', error => issues.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error') {
      const issue = `console: ${message.text()}`
      if (message.text().includes('Failed to load resource')) externalResourceIssues.push(issue)
      else issues.push(issue)
    }
  })
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') {
      const issue = `request failed: ${request.url()} (${request.failure()?.errorText})`
      if (request.url().startsWith(ownOrigin)) issues.push(issue)
      else externalResourceIssues.push(issue)
    }
  })
  page.on('response', response => {
    if (response.status() >= 400) {
      const issue = `HTTP ${response.status()}: ${response.url()}`
      if (response.url().startsWith(ownOrigin)) issues.push(issue)
      else externalResourceIssues.push(issue)
    }
  })

  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle(/ГАРАЖ/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('ВАШ АВТОМОБИЛЬ.')
  await expect(page.getByRole('heading', { name: /ЗАБОТА/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: /ПОРА/ })).toBeVisible()
  await expect(page.locator('#top')).toBeVisible()

  for (const id of ['services', 'about', 'process', 'contacts']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1)
    await expect(page.locator(`a[href="#${id}"]`).first()).toBeVisible()
  }

  const hrefs = await page.locator('a[href]').evaluateAll(links =>
    links.map(link => (link as HTMLAnchorElement).getAttribute('href') ?? ''),
  )
  for (const href of hrefs.filter(value => value.startsWith('#'))) {
    await expect(page.locator(href)).toHaveCount(1)
  }
  expect(hrefs.some(href => href.startsWith('tel:'))).toBeTruthy()
  expect(hrefs.some(href => href.startsWith('https://'))).toBeTruthy()

  // Third party font/photo requests can remain pending in restricted networks.
  // Keep a bounded settling window while still collecting their failures.
  await page.waitForTimeout(5000)
  expect(issues, 'JavaScript console, runtime, and local resource errors').toEqual([])
  if (externalResourceIssues.length) {
    testInfo.annotations.push({ type: 'external-resource', description: externalResourceIssues.join('\n') })
  }
})

test('booking prompts, dismiss control, and phone link work', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.getByRole('button', { name: /Записаться/ }).first().click()
  const notice = page.getByRole('status')
  await expect(notice).toBeVisible()
  await expect(notice.getByRole('link')).toHaveAttribute('href', /^tel:/)
  await notice.getByRole('button', { name: 'Закрыть' }).click()
  await expect(notice).toBeHidden()
  await page.getByRole('button', { name: /Записаться/ }).last().click()
  await expect(notice).toBeVisible()
})

test('a repeated booking click keeps the refreshed prompt visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const booking = page.getByRole('button', { name: /Записаться/ }).first()
  await booking.click()
  await page.waitForTimeout(3500)
  await booking.click()
  await page.waitForTimeout(1200)
  await expect(page.getByRole('status')).toBeVisible()
})

test('mobile navigation opens and closes after following a section link', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const toggle = page.getByRole('button', { name: 'Открыть меню' })
  await expect(toggle).toBeVisible()
  await toggle.click()
  const nav = page.getByRole('navigation', { name: 'Основная навигация' })
  await expect(nav).toBeVisible()
  await nav.getByRole('link', { name: 'Услуги' }).click()
  await expect(page).toHaveURL(/#services$/)
  await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeVisible()
})

test('about decorative years stay below the copy and above the contacts section on mobile', async ({ page }) => {
  for (const width of [320, 360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 850 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const copyLink = await page.getByRole('link', { name: 'Приезжайте знакомиться' }).boundingBox()
    const years = await page.locator('.about-number').boundingBox()
    const contacts = await page.locator('#contacts').boundingBox()
    expect(copyLink, `about link is visible at ${width}px`).not.toBeNull()
    expect(years, `decorative years are visible at ${width}px`).not.toBeNull()
    expect(contacts, `contacts section is visible at ${width}px`).not.toBeNull()
    expect(years!.y, `years overlap the about link at ${width}px`).toBeGreaterThanOrEqual(copyLink!.y + copyLink!.height)
    expect(contacts!.y, `years overlap the next section at ${width}px`).toBeGreaterThanOrEqual(years!.y + years!.height)
  }
})

test('layout fits requested viewports and saves review screenshots', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Responsive matrix is run in Chromium only')
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 500 ? 850 : 1000 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }))
    expect(dimensions.document, `document overflows at ${width}px: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(width)
    expect(dimensions.body, `body overflows at ${width}px: ${JSON.stringify(dimensions)}`).toBeLessThanOrEqual(width)
    await expect(page.locator('h1')).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath(`viewport-${width}.png`), fullPage: true })
  }
})

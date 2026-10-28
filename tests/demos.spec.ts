import { expect, test } from '@playwright/test'

const routes = [
  ['mobishin22', 'Мобишин22', ['+7 903 911-72-21', '+7 960 940-77-78', '+7 901 207-75-05']], ['shinny-servis', 'Шинный сервис', ['+7 (3852) 60-24-04', '+7 913 226-34-54']],
  ['park-koles', 'Парк Колес', ['+7 (3852) 53-46-76']], ['mikano', 'Микано', ['+7 933 160-00-18']],
  ['k22powerteam', 'K22PowerTeam', ['+7 (3852) 60-66-96', '+7 913 210-66-96', '+7 913 210-69-69']], ['kardannye-valy', 'Отдел ремонта карданных валов', ['+7 996 705-55-91']],
  ['detailing', 'Детейлинг-центр', []], ['genstart', 'ГенСтарт', ['+7 983 175-01-01']], ['jg', 'JG', ['+7 (3852) 57-32-56', '+7 906 968-62-25']],
  ['avtoelektrik', 'Автоэлектрик', ['+7 929 397-32-56']], ['racetech', 'Raceтех', ['+7 923 169-50-28', '+7 961 300-99-05']],
  ['ekogorod', 'ЭкоГород', ['+7 961 998-04-27']], ['u-dorogi', 'У дороги', ['+7 923 728-44-19', '+7 (3852) 99-52-82']],
  ['shinomontazh-1', 'Шиномонтажная мастерская', ['+7 999 476-24-84']], ['altai-shinka', 'Алтай шинка', ['+7 913 269-50-58']],
  ['lemaks', 'Лемакс', ['+7 983 100-04-80']], ['shinomontazh-2', 'Шиномонтажная мастерская №2', ['+7 929 394-51-53']],
  ['remont-avto22', 'Ремонт Авто22', ['+7 960 961-07-77']], ['shinomontazh-3', 'Шиномонтажная мастерская №3', ['+7 952 002-48-18']],
  ['shinomontazh-4', 'Шиномонтажная мастерская №4', ['+7 952 006-12-88']], ['avtoservis', 'Автосервис', ['+7 913 276-27-77']],
  ['shinomontazh-sto', 'Шиномонтажная мастерская и СТО', ['+7 961 231-71-73', '+7 960 937-69-09']],
  ['sibirskiy-krokodil', 'Сибирский крокодил', ['+7 996 457-66-43']], ['avtomagnat', 'Автомагнат', ['+7 963 537-53-78']],
  ['shinomontazh-5', 'Шиномонтажная мастерская №5', ['+7 964 086-69-93']],
  ['gruzovaya-avtomoyka', 'Грузовая автомойка и грузовой/легковой шиномонтаж', ['+7 961 239-58-27']],
  ['shinomontazh-6', 'Шиномонтажная мастерская №6', ['+7 958 396-67-40']],
] as const

const pageIssues = new WeakMap<object, string[]>()

test.beforeEach(async ({ page }) => {
  const issues: string[] = []
  pageIssues.set(page, issues)
  page.on('pageerror', error => issues.push(`pageerror: ${error.message}`))
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource')) issues.push(`console: ${message.text()}`)
  })
  page.on('requestfailed', request => {
    if (request.url().startsWith('http://127.0.0.1:4173') && request.failure()?.errorText !== 'net::ERR_ABORTED') issues.push(`request failed: ${request.url()}`)
  })
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) issues.push(`HTTP ${response.status()}: ${response.url()}`)
  })
})

test.afterEach(async ({ page }) => {
  expect(pageIssues.get(page) ?? [], 'JavaScript errors and local failed resources').toEqual([])
})

test('internal catalog lists all 27 separate previews', async ({ page }) => {
  await page.goto('/demos', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Демо-сайты для бизнеса.' })).toBeVisible()
  await expect(page.locator('.catalog-card')).toHaveCount(27)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  await page.locator('a.catalog-card[href="/demo/mobishin22"]').click()
  await expect(page).toHaveURL(/\/demo\/mobishin22$/)
})

for (const [slug, name, expectedPhones] of routes) {
  test(`${slug} opens directly with its own contact data`, async ({ page }) => {
    await page.goto(`/demo/${slug}`, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('.business-logo').first()).toContainText(name)
    if (expectedPhones.length) {
      const contact = page.locator('#contacts')
      const contacts = contact.locator('.contact-phone')
      await expect(contacts).toHaveCount(expectedPhones.length)
      for (const [index, expectedPhone] of expectedPhones.entries()) {
        const phoneDigits = expectedPhone.replace(/\D/g, '')
        const actual = await contacts.nth(index).evaluate(element => ({ text: element.querySelector('strong')?.textContent?.replace(/\D/g, ''), href: element.getAttribute('href') }))
        expect(actual.text, `${slug} phone ${index + 1} display`).toBe(phoneDigits)
        expect(actual.href, `${slug} phone ${index + 1} tel target`).toBe(`tel:+${phoneDigits}`)
      }
    } else {
      await expect(page.locator('.contact-missing')).toContainText('не предоставлен')
      await expect(page.locator('#contacts a[href^="tel:"]')).toHaveCount(0)
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
    await expect(page.locator('.hero-secondary')).toBeVisible()
    await page.locator('.hero-secondary').click()
    await expect(page).toHaveURL(/#(services|approach)$/)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const brokenImages = await page.locator('img').evaluateAll(images => images.filter(image => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0).length)
    expect(brokenImages, `${slug} has no broken images`).toBe(0)
  })
}

test('all demos fit mobile and desktop sizes without overlap and keep the CTA visible', async ({ page }, testInfo) => {
  test.setTimeout(120_000)
  const sizes = [{ width: 375, height: 812 }, { width: 390, height: 844 }, { width: 1440, height: 900 }]
  for (const [slug] of routes) {
    await page.goto(`/demo/${slug}`, { waitUntil: 'domcontentloaded' })
    for (const size of sizes) {
      await page.setViewportSize(size)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(page.locator('.hero-buttons a').first()).toBeVisible()
      const layout = await page.evaluate(() => {
        const rect = (selector: string) => {
          const element = document.querySelector<HTMLElement>(selector)
          if (!element) return null
          const r = element.getBoundingClientRect()
          const style = getComputedStyle(element)
          return { x: r.x, y: r.y, right: r.right, bottom: r.bottom, width: r.width, height: r.height, fontSize: parseFloat(style.fontSize) }
        }
        const heading = rect('.hero-copy h1')
        const cta = rect('.hero-buttons')
        const viewport = document.documentElement.clientWidth
        const overlap = Boolean(heading && cta && heading.x < cta.right && heading.right > cta.x && heading.y < cta.bottom && heading.bottom > cta.y)
        return { viewport, document: document.documentElement.scrollWidth, body: document.body.scrollWidth, heading, cta, overlap }
      })
      expect(layout.document, `${slug} document overflow at ${size.width}px`).toBeLessThanOrEqual(size.width)
      expect(layout.body, `${slug} body overflow at ${size.width}px`).toBeLessThanOrEqual(size.width)
      expect(layout.heading, `${slug} heading exists`).not.toBeNull()
      expect(layout.heading!.fontSize, `${slug} heading readable at ${size.width}px`).toBeGreaterThanOrEqual(48)
      expect(layout.overlap, `${slug} heading and CTA don't overlap at ${size.width}px`).toBeFalsy()
      expect(layout.cta!.bottom, `${slug} hero CTA stays in view at ${size.width}px`).toBeLessThanOrEqual(size.height)
      if (testInfo.project.name === 'chromium' && ['mobishin22', 'detailing', 'k22powerteam', 'gruzovaya-avtomoyka'].includes(slug)) {
        await page.screenshot({ path: testInfo.outputPath(`${slug}-${size.width}.png`), fullPage: true })
      }
    }
  }
  await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/demo/mobishin22', { waitUntil: 'domcontentloaded' })
  const toggle = page.getByRole('button', { name: 'Открыть меню' })
  await toggle.click()
  await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible()
  await page.getByRole('navigation').getByRole('link', { name: 'Контакты' }).click()
  await expect(page).toHaveURL(/#contacts$/)
})

test('root stays on GARAGE and unknown demo route has a useful fallback', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.brand').first()).toBeVisible()
  await expect(page.locator('#top')).toBeVisible()
  await page.goto('/demo/no-such-business')
  await expect(page.getByRole('heading', { name: 'Демо не найдено' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'В каталог' })).toHaveAttribute('href', '/demos')
})

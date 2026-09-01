const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright-core')

// Keep both apps on the same hostname so Chrome can persist the signed auth
// cookies used by the legacy Express API during the admin flow.
const BASE_URL = process.env.INIT3_BASE_URL || 'http://localhost:3000'
const API_URL = process.env.INIT3_API_URL || 'http://localhost:8001'
const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUTPUT_DIR = path.resolve(__dirname, '../../ss')

const DISPLAY = {
  width: Number(process.env.SCREENSHOT_WIDTH || 1470),
  height: Number(process.env.SCREENSHOT_HEIGHT || 956),
  deviceScaleFactor: Number(process.env.SCREENSHOT_SCALE || 2),
}

const ADMIN = {
  userName: process.env.INIT3_ADMIN_USERNAME || 'demo_admin',
  password: process.env.INIT3_ADMIN_PASSWORD || 'DemoAdmin123!',
}

const report = {
  display: DISPLAY,
  pages: [],
  consoleErrors: [],
  failedRequests: [],
  httpErrors: [],
}

async function assertAvailable(url, label) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}: ${url}`)
  }
}

async function settle(page, readyText) {
  if (readyText) {
    await page.getByText(readyText, { exact: false }).first().waitFor({
      state: 'visible',
      timeout: 15_000,
    })
  }

  await page.waitForFunction(() => document.readyState === 'complete')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)
}

async function auditPage(page, name, route) {
  const audit = await page.evaluate(() => {
    const brokenImages = [...document.images]
      .filter((img) => {
        const rect = img.getBoundingClientRect()
        const isRendered =
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom >= 0 &&
          rect.top <= window.innerHeight
        return isRendered && (!img.complete || img.naturalWidth === 0)
      })
      .map((img) => ({ alt: img.alt, src: img.currentSrc || img.src }))

    const heading = document.querySelector('h1, h2, h3')
    return {
      title: document.title,
      heading: heading ? heading.textContent.trim() : '',
      brokenImages,
      bodyPreview: document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 180),
    }
  })

  report.pages.push({ name, route, ...audit })
  return audit
}

async function screenshot(page, name, route, options = {}) {
  await page.goto(`${BASE_URL}${route}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  })
  await settle(page, options.readyText)

  if (options.scrollY) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), options.scrollY)
    await page.waitForTimeout(350)
  }

  if (options.prepare) {
    await options.prepare(page)
    await page.waitForTimeout(350)
  }

  const audit = await auditPage(page, name, route)
  const outputPath = path.join(OUTPUT_DIR, `${name}.png`)
  await page.screenshot({
    path: outputPath,
    fullPage: options.fullPage || false,
    animations: 'disabled',
  })

  const broken = audit.brokenImages.length
  console.log(`captured ${name}.png (${broken} broken image${broken === 1 ? '' : 's'})`)
}

async function openAdminNavigation(page) {
  const toggle = page.getByLabel('open-close')
  await toggle.waitFor({ state: 'visible', timeout: 10_000 })
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click()
  }
  await page
    .getByRole('button', { name: 'Dashboard', exact: true })
    .waitFor({ state: 'visible' })
}

async function closeAdminNavigation(page) {
  const toggle = page.getByLabel('open-close')
  await toggle.waitFor({ state: 'visible', timeout: 10_000 })
  if ((await toggle.getAttribute('aria-expanded')) === 'true') {
    await toggle.click()
  }
}

async function loginAsAdmin(page) {
  await page.goto(`${BASE_URL}/adminLogin`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  })
  await settle(page, 'Administrator sign in')
  await page.getByLabel('Username').fill(ADMIN.userName)
  await page.getByLabel('Password').fill(ADMIN.password)

  await Promise.all([
    page.waitForURL(/\/admin\/?$/, { timeout: 15_000 }),
    page.getByRole('button', { name: 'Sign in' }).click(),
  ])
  await page.getByLabel('open-close').waitFor({ state: 'visible', timeout: 15_000 })
  await settle(page, 'Campus Ambassadors')
}

async function main() {
  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Google Chrome was not found at ${CHROME_PATH}`)
  }

  await assertAvailable(BASE_URL, 'Frontend')
  await assertAvailable(`${API_URL}/api/events?value=1`, 'Backend API')
  const eventsResponse = await fetch(`${API_URL}/api/events?value=1`)
  const eventsPayload = await eventsResponse.json()
  const featuredEvent = eventsPayload.result?.[0]
  if (!featuredEvent) {
    throw new Error('The seeded API did not return a featured event')
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--disable-dev-shm-usage'],
  })

  const context = await browser.newContext({
    viewport: { width: DISPLAY.width, height: DISPLAY.height },
    deviceScaleFactor: DISPLAY.deviceScaleFactor,
    colorScheme: 'light',
    locale: 'en-US',
    reducedMotion: 'reduce',
  })

  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') {
      report.consoleErrors.push({ url: page.url(), text: message.text() })
    }
  })
  page.on('requestfailed', (request) => {
    const failure = request.failure()
    report.failedRequests.push({
      page: page.url(),
      url: request.url(),
      error: failure ? failure.errorText : 'unknown',
    })
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      report.httpErrors.push({
        page: page.url(),
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      })
    }
  })

  try {
    await screenshot(page, 'landing-hero', '/', { readyText: 'Register Now!' })
    await screenshot(page, 'public-events', '/', {
      readyText: 'Register Now!',
      prepare: async (targetPage) => {
        await targetPage.getByRole('link', { name: 'Events' }).hover()
        await targetPage.getByText(featuredEvent.name, { exact: true }).waitFor({
          state: 'visible',
          timeout: 10_000,
        })
      },
    })
    await screenshot(page, 'event-details', `/event/${featuredEvent.value}`, {
      readyText: featuredEvent.name,
      scrollY: 300,
    })
    await screenshot(page, 'gallery', '/gallery', {
      readyText: 'Our colourful days',
      scrollY: 100,
    })
    await screenshot(page, 'participant-registration', '/registration/participant', {
      readyText: 'Create Account',
      scrollY: 20,
    })
    await screenshot(page, 'faq', '/faq', { readyText: 'Frequently' })
    await loginAsAdmin(page)
    await screenshot(page, 'admin-dashboard', '/admin', {
      readyText: 'Campus Ambassadors',
      prepare: openAdminNavigation,
    })
    await screenshot(page, 'admin-participants', '/admin/participants', {
      readyText: 'QR / Class',
      prepare: closeAdminNavigation,
    })
    await screenshot(page, 'admin-events', '/admin/events', {
      readyText: 'Event management',
      prepare: openAdminNavigation,
    })
    await screenshot(page, 'admin-settings', '/admin/setting', {
      readyText: 'Current event',
      prepare: openAdminNavigation,
    })
    await screenshot(page, 'admin-contacts', '/admin/contacts', {
      readyText: 'Reply status',
      prepare: openAdminNavigation,
    })
    await screenshot(page, 'admin-gallery', '/admin/gallery', {
      readyText: 'Gallery',
      prepare: openAdminNavigation,
    })
  } finally {
    await browser.close()
  }

  console.log(`\nSaved screenshots to ${OUTPUT_DIR}`)
  console.log(`viewport ${DISPLAY.width}x${DISPLAY.height} at ${DISPLAY.deviceScaleFactor}x scale`)
  console.log(`console errors: ${report.consoleErrors.length}`)
  console.log(`failed requests: ${report.failedRequests.length}`)
  console.log(`HTTP errors: ${report.httpErrors.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

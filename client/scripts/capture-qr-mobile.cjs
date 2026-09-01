const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('playwright-core')

const BASE_URL = process.env.INIT3_BASE_URL || 'http://localhost:3000'
const API_URL = process.env.INIT3_API_URL || 'http://localhost:8001'
const CHROME_PATH =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUTPUT_DIR = path.resolve(__dirname, '../../ss')

// Apple specifies a 1206x2622 physical display for iPhone 17 Pro. At the
// platform's 3x scale, this is the corresponding 402x874 CSS viewport.
const IPHONE_17_PRO = {
  width: 402,
  height: 874,
  deviceScaleFactor: 3,
}

const QR_ADMIN = {
  userName: process.env.INIT3_QR_USERNAME || 'demo_scanner',
  password: process.env.INIT3_QR_PASSWORD || 'DemoUser123!',
}

const report = {
  device: 'iPhone 17 Pro',
  viewport: IPHONE_17_PRO,
  outputPixels: {
    width: IPHONE_17_PRO.width * IPHONE_17_PRO.deviceScaleFactor,
    height: IPHONE_17_PRO.height * IPHONE_17_PRO.deviceScaleFactor,
  },
  route: '/qrScanner',
  brokenImages: [],
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

async function main() {
  if (!fs.existsSync(CHROME_PATH)) {
    throw new Error(`Google Chrome was not found at ${CHROME_PATH}`)
  }

  await assertAvailable(BASE_URL, 'Frontend')
  await assertAvailable(`${API_URL}/api/events?value=1`, 'Backend API')
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: [
      '--disable-dev-shm-usage',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  })

  const context = await browser.newContext({
    viewport: {
      width: IPHONE_17_PRO.width,
      height: IPHONE_17_PRO.height,
    },
    deviceScaleFactor: IPHONE_17_PRO.deviceScaleFactor,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light',
    locale: 'en-US',
    reducedMotion: 'reduce',
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
  })
  await context.grantPermissions(['camera'], { origin: BASE_URL })

  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') {
      report.consoleErrors.push({ url: page.url(), text: message.text() })
    }
  })
  page.on('requestfailed', (request) => {
    report.failedRequests.push({
      url: request.url(),
      error: request.failure()?.errorText || 'unknown',
    })
  })
  page.on('response', (response) => {
    if (response.status() >= 400) {
      report.httpErrors.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      })
    }
  })

  try {
    await page.goto(`${BASE_URL}/qrLogin`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    })
    await page.getByLabel('userName').fill(QR_ADMIN.userName)
    await page.getByLabel('password').fill(QR_ADMIN.password)
    await Promise.all([
      page.waitForURL(/\/qrScanner\/?$/, { timeout: 15_000 }),
      page.getByRole('button', { name: 'Submit' }).click(),
    ])

    // Use the scanner's built-in manual fallback to load a real seeded attendee,
    // then return to camera mode. This keeps the capture deterministic while
    // demonstrating the information an operator sees after a successful read.
    await page.getByRole('button', { name: 'search', exact: true }).click()
    const searchInput = page.getByPlaceholder('search name')
    await searchInput.fill('A')
    const attendee = page.getByText('Arafat Rahman', { exact: true })
    await attendee.first().waitFor({ state: 'visible', timeout: 15_000 })
    await attendee.first().click()
    await page.getByText('Already scanned', { exact: false }).waitFor({
      state: 'visible',
      timeout: 15_000,
    })
    await page.getByRole('button', { name: 'scan', exact: true }).click()

    const cameraPrompt = page.getByText('click to start the camera', {
      exact: false,
    })
    await cameraPrompt.waitFor({ state: 'visible', timeout: 15_000 })
    await cameraPrompt.click()

    const video = page.locator('video').first()
    await video.waitFor({ state: 'visible', timeout: 15_000 })
    await page.waitForFunction(() => {
      const target = document.querySelector('video')
      return target && target.readyState >= 2 && target.videoWidth > 0
    })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1000)

    report.brokenImages = await page.evaluate(() =>
      [...document.images]
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => ({ alt: img.alt, src: img.currentSrc || img.src }))
    )
    report.bodyPreview = await page.evaluate(() =>
      document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 240)
    )

    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'qr-scanner-iphone-17-pro.png'),
      fullPage: false,
      animations: 'disabled',
    })
  } finally {
    await browser.close()
  }

  console.log('captured qr-scanner-iphone-17-pro.png')
  console.log('viewport 402x874 at 3x scale (1206x2622 output)')
  console.log(`broken images: ${report.brokenImages.length}`)
  console.log(`console errors: ${report.consoleErrors.length}`)
  console.log(`failed requests: ${report.failedRequests.length}`)
  console.log(`HTTP errors: ${report.httpErrors.length}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

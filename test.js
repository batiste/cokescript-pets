const puppeteer = require('puppeteer')
const server = require('./server/server.coke.js')
let browser
let frontendServer

function successfulLogin(page) {
  page.on('dialog', async dialog => {
    await dialog.accept('batiste:password')
  })
}

// here a a few very high level end-to-end tests
// that should give a rather high test coverage
describe('Pet store', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
    })
    frontendServer = await server.app.listen(3000)
  })
  afterAll(async () => {
    await browser.close()
    await frontendServer.close()
  })

  it('Should login without error', async () => {
    let page = await browser.newPage()
    successfulLogin(page)
    await page.goto('http://localhost:3000')
    await page.waitFor(1000)
    const text = await page.evaluate(() => document.body.textContent)
    expect(text).toContain('Pet list')
    await page.close()
  })
  
  it('Should be able to create a pet', async () => {
    let page = await browser.newPage()
    successfulLogin(page)
    await page.goto('http://localhost:3000')
    await page.waitFor(1000)
    await page.type('#name', 'GOOD BOY')
    await page.waitFor(1000)
    await page.click('#addPetButton')
    await page.waitFor(1000)
    const text = await page.evaluate(() => document.body.textContent)
    expect(text).toContain('GOOD BOY')
    await page.close()
  })
})

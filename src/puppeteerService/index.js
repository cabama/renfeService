const puppeteer = require('puppeteer')
const moment = require('moment')

const { getObjectFromlistaTrenesTable } = require('./browserScripts')
const { waitPriceTableIsLoaded, setDateInForm } = require('./helpers')

const COORD_FERNANDO_ZOBEL = '0071,03208,03208'
const COORD_ATOCHA = '0071,60000,00600'

module.exports.places = {
  cuenca: COORD_FERNANDO_ZOBEL,
  madrid: COORD_ATOCHA
}

const prodPuppeteerArguments = {
  args: [
    // Required for Docker version of Puppeteer
    '--no-sandbox',
    '--disable-setuid-sandbox',
    // This will write shared memory files into /tmp instead of /dev/shm,
    // because Docker’s default for /dev/shm is 64MB
    '--disable-dev-shm-usage'
  ]
}

const devPuppeteerArguments = { headless: true }

const PuppeteerArguments = process.env.MODE === 'PROD'
  ? prodPuppeteerArguments
  : devPuppeteerArguments

module.exports.getTrains = async (date, cordOrigen, cordDestino) => {
  const parsedDate = moment(date).format('DD/MM/YYYY')
  const browser = await puppeteer.launch(PuppeteerArguments)
  const page = await browser.newPage()
  await page.goto('http://www.renfe.com/')
  await page.evaluate(
    (origen, destino, date) => {
      document.querySelector('#cdgoOrigen').value = origen
      document.querySelector('#cdgoDestino').value = destino
      document.querySelector('#__fechaIdaVisual').value = date
      document.querySelector('.btn.btn_home').click()
    },
    cordOrigen,
    cordDestino,
    parsedDate
  )
  await page.waitForNavigation()
  await setDateInForm(page, date)
  const listaTrenes = await waitPriceTableIsLoaded(page)
    .then(() => page.evaluate(getObjectFromlistaTrenesTable))
  await browser.close()
  return listaTrenes
}
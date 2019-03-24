var moment = require('moment')

module.exports.waitPriceTableIsLoaded = page =>
  new Promise(async (res, rej) => {
    const getElements = async () => {
      const classes = await page.evaluate(() => {
        return document.getElementById('tab-listado').className
      })
      return classes
    }
    const loadedTimeout = setInterval(async () => {
      let classes = await getElements()
      if (classes !== 'tab-pane active') return
      clearInterval(loadedTimeout)
      res()
    }, 100)
  })

module.exports.setDateInForm = async (page, date) => {
  const parseDate = moment(date).format('DD/MM/YYYY')
  console.log('Parse Date', parseDate)
  return await page.evaluate(fecha => {
    document.querySelector('#fechaSeleccionada0').click()
    document.querySelector('#fechaSeleccionada0').value = fecha
  }, parseDate)
}
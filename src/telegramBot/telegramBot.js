const TelegramBot = require('node-telegram-bot-api')
const moment = require('moment')
const { getTrains, places } = require('../puppeteerService/index')
const { parserRenfeResponse, filterByPrice } = require('./parser')

// replace the value below with the Telegram token you receive from @BotFather
console.log('TELEGRAM TOKEN: ', process.env.TELEGRAM_TOKEN)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true })

// Matches "/echo [whatever]"
bot.onText(/\/getprecios.* (.*) (.*)/, (msg, match) => {

  // capture variables
  const chatId = msg.chat.id;
  const destino = match[1] // the captured "whatever"
  const fecha = match[2]

  // Parse places
  const {origenCoord, destinoCoord} = (destino === 'cuenca')
    ? {origenCoord: places.madrid, destinoCoord: places.cuenca}
    : {origenCoord: places.cuenca, destinoCoord: places.madrid}
  // Parse date
  var dateParts = fecha.split('/')
  var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

  getTrains(dateObject, origenCoord, destinoCoord).then(trains => {
    console.log(trains)
    bot.sendMessage(chatId, parserRenfeResponse(trains))
  })

});


bot.onText(/\/finde (.*)€/, async (msg, match) => {

  const chatId = msg.chat.id;
  const maxPrice = match[1] // the captured "whatever"

  async function filterTrainsAndSendMessage (date, origen, destino) {
    return await getTrains(date, origen, destino).then(trains => {
      const filteredTrains = filterByPrice(maxPrice, trains)
      bot.sendMessage(chatId, parserRenfeResponse(filteredTrains))
    })
  }

  async function getPricesOfWeekend (friday, sunday, monday) {
    const fridayDate = friday.toDate()
    const sundayDate = sunday.toDate()
    const mondayDate = monday.toDate()
    await filterTrainsAndSendMessage(fridayDate, places.madrid, places.cuenca)
    await filterTrainsAndSendMessage(sundayDate, places.cuenca, places.madrid)
    await filterTrainsAndSendMessage(mondayDate, places.cuenca, places.madrid)
  }
  
  const nextFriday = moment().day(5)
  const nextSaturday = moment().day(7)
  const nextSunday = moment().day(1)

  const numberOfWeeks = 4
  for (let i = 0; i < numberOfWeeks; i ++){
    if (i > 0){
      nextFriday.add(1, 'week')
      nextSaturday.add(1, 'week')
      nextSunday.add(1, 'week')
    }
    getPricesOfWeekend(nextFriday, nextSaturday, nextSunday)
  }

});

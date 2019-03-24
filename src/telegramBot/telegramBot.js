const TelegramBot = require('node-telegram-bot-api');
const { getTrains, places } = require('../puppeteerService/index')
const { parserRenfeResponse } = require('./parser')

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

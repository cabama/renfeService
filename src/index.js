const {getTrains} = require('./puppeteerService/index')
require('./telegramBot/telegramBot')
const COORD_FERNANDO_ZOBEL = '0071,03208,03208'
const COORD_ATOCHA = '0071,60000,00600'

async function main() {
  const trains = await getTrains(new Date(), COORD_FERNANDO_ZOBEL, COORD_ATOCHA)
  console.log(trains)
}

main ()
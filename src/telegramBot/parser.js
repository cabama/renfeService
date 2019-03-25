const moment = require('moment')

module.exports.parserRenfeResponse = (trains) => trains
  .map((train) => `*Tren ${moment(train.date).format('DD/MM/YYYY')}*
  ${train.origen} - ${train.destino}
  Hora: ${train.colSalida}
  Llegada ${train.colLlegada}
  Precio: ${train.colPrecio}
  Clase: ${train.colClase}
  `).join('\n')

module.exports.filterByPrice = (price, trains) => trains
  .map(train => {
    try {
      train.colPrecio = Number(
        train.colPrecio.split(' ')[0].replace(',', '.')
      )
    } catch {
      train.colPrecio = -1
    }
    return train
  })
  .filter(train => train.colPrecio < price && train.colPrecio > 0)
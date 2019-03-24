module.exports.parserRenfeResponse = (trains) => trains
.map( (train, index) => `*Tren ${index + 1}*
Hora: ${train.colSalida}
Llegada ${train.colLlegada}
Precio: ${train.colPrecio}
Clase: ${train.colClase}
`).join('\n')

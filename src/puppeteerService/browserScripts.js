module.exports.getObjectFromlistaTrenesTable = () => {
  return Array.from(document.querySelectorAll('#listaTrenesTable tr.trayectoRow'))
  .map(row => 
    Array.from(row.querySelectorAll('td[headers]'))
    .slice(0, -1)
    .reduce((acc, td) => {
      acc[td.headers] = td.firstElementChild.innerText
      return acc
    }, {})
  )
}
const indicatorts = require('indicatorts')

const sma = indicatorts.sma([1, 2, 3, 5, 6, 7, 8, 8, 10, 15, 25, 20, 10, 22, 10, 18, 12, 30, 35, 30, 20], { period: 10 })
console.log(sma)



const indicatorts = require('indicatorts')
const tradingSignals = require('trading-signals')

const sma = indicatorts.sma([1, 2, 3, 5, 6, 7, 8, 8, 10, 15, 25, 20, 10, 22, 10, 18, 12, 30, 35, 30, 20])
console.log(sma)




const SMA = tradingSignals.SMA(10)


console.log(SMA.getResult().toFixed(2))

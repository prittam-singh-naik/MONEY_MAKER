
const date = 19
const startTime = new Date( new Date(new Date(new Date().setDate(date)).setHours(3)).setMinutes(0) )
const endTime = new Date( new Date(new Date(new Date().setDate(date)).setHours(10)).setMinutes(0) )

console.log(`startTime:: `, Date.parse(startTime.toString()))
console.log(`endTime:: `, Date.parse(endTime.toString()))

const Query = [
        {
                $project: {
                        price: "$data.last_traded_price",
                        token: "$data.token",
                        timestamp: {
                                $convert: {
                                        input: "$data.exchange_timestamp",
                                        to: 'long'
                                }
                        },
                }
        },
        {
                $match: {
                        timestamp: {
                                $gte: Date.parse(startTime.toString()),
                                $lte: Date.parse(endTime.toString()),
                        },
                }
        },
        {
                $group: {
                        _id: "$token",
                        priceAnsTimestamps: {
                                $push: {
                                        price: "$price",
                                        time: "$timestamp"
                                }
                        }
                }
        }
]






// ========= LOGIC ===============

const asciichart = require('asciichart');

const data = require('./livedata/19Jan2024')

const price = data.priceAndTimestamps.sort((a, b) => a.time.$numberLong - b.time.$numberLong).map(e => ({ price: e.price.substring(0, e.price.length - 2), time: new Date(parseInt(e.time.$numberLong)).toLocaleString() }))

const chartData = price.map(e => +e.price).filter((e, index) => index < 140)

// const chart = asciichart.plot(chartData, { height: 10 });
// console.log(chart)

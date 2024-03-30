const asciichart = require('asciichart');
const { getFibRetracement, levels } = require('fib-retracement')
const data = require('./historicaldata/23_02_2024_BANKNIFTY_ONE_MINUTE')

let price = []
data.sort((a, b) => Date.parse(a[0]) - Date.parse(b[0])).forEach(e => {
        
        const filledData = fillPriceGaps(e)

        const dateString = new Date( new Date(e[0]).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 ).toLocaleTimeString()
        const objData = filledData.map(price => ({ timestamp: dateString, price }) )
        
        price = [...price, ...objData]

        // if (dateString === `9:45:00 am`) {

        //         console.log(filledData)
        // }
})

// console.log(price[0], price[1])

const newData = price


const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

let swingListNew = []

let startingPoint = 0

const minSwingLength = 100
let direction = NEUTRAL

const findSwings = (price) => {

        if (!startingPoint) return startingPoint = high = low = price

        high = price > high ? price : high
        low = price < low ? price : low

        // =======START=================== SET INITIAL SWING ----- CALCULATE FROM STARTING POINT =======================START========
        if (direction === NEUTRAL) {
                if (price > (startingPoint + minSwingLength)) {

                        swingListNew.push({
                                start: low,
                                end: price,
                                low: low,
                                high: price,
                                direction: UP,
                                fibLevel: getFibRetracement(low, price),
                        })
                        direction = UP
                }
                if (price < (startingPoint - minSwingLength)) {

                        swingListNew.push({
                                start: high,
                                end: price,
                                high: high,
                                low: price,
                                direction: DOWN,
                                fibLevel: getFibRetracement(high, price),
                        })

                        direction = DOWN
                }
                return
        }
        // =======END=================== SET INITIAL SWING ----- CALCULATE FROM STARTING POINT =======================END========



        // =======START=================== ADD NEW SWING =======================START========

        if (direction === UP && price < (high - minSwingLength)) {

                swingListNew.push({
                        start: high,
                        end: price,
                        direction: DOWN,
                        fibLevel: getFibRetracement(high, price),
                        low: price,
                        high: high,
                })
                direction = DOWN
                low = price
        }

        if (direction === DOWN && price > (low + minSwingLength)) {

                swingListNew.push({
                        start: low,
                        end: price,
                        direction: UP,
                        fibLevel: getFibRetracement(low, price),
                        high: price,
                        low: low,
                })
                direction = UP
                high = price
        }

        // =======END=================== ADD NEW SWING =======================END========



        // =======START=================== UPDATE SWING VALUE =======================START========
        swingListNew.forEach(swing => {
                if (swing['1-Touch']) return

                if (swing.direction === UP && price > swing.high) {

                        swing.high = price
                        swing.end = price
                        swing.fibLevel = getFibRetracement(swing.low, swing.high)
                        swing.isValueChanged = true

                        delete swing['0.236-Touch']
                        delete swing['0.382-Touch']
                        delete swing['0.5-Touch']
                        delete swing['0.618-Touch']
                        delete swing['0.786-Touch']

                        delete swing['0.236']
                        delete swing['0.382']
                        delete swing['0.5']
                        delete swing['0.618']
                        delete swing['0.786']

                }

                if (swing.direction === DOWN && price < swing.low) {

                        swing.low = price
                        swing.end = price
                        swing.fibLevel = getFibRetracement(swing.high, swing.low)
                        swing.isValueChanged = true

                        delete swing['0.236-Touch']
                        delete swing['0.382-Touch']
                        delete swing['0.5-Touch']
                        delete swing['0.618-Touch']
                        delete swing['0.786-Touch']

                        delete swing['0.236']
                        delete swing['0.382']
                        delete swing['0.5']
                        delete swing['0.618']
                        delete swing['0.786']
                }

        })

        // =======END=================== UPDATE SWING VALUE =======================END========



        // Delete unnessery swings those are convered 100%

        swingListNew.forEach((e, index) => {

                if (e.direction === UP && price <= (e.start + 1)) e.isDeleted = true

                if (e.direction === DOWN && price >= (e.start - 1)) e.isDeleted = true
        })


}


const entryList = []
let count = 0
const checkFibLabelTouch = (price, time) => {
        try {
                swingListNew.forEach((swing, index) => {
                        
                        if (!swing.isValueChanged || swing.isDeleted) return

                        swing.isValueChanged = false

                        for (let fibKey of ['1', '0.786', '0.618', '0.5', '0.382', '0.236', '0']) {

                                if (swing[fibKey + '-Touch']) break     // no need check other small lavels, because they ware touched already

                                const lowerLevel = swing.fibLevel[fibKey] - 1
                                const upperLevel = swing.fibLevel[fibKey] + 1

                                if (swing.direction === DOWN && price >= lowerLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true
                                        break
                                }

                                if (swing.direction === UP && price <= upperLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true
                                        break
                                }
                        }
                })
        } catch (err) {
                console.error(`Error in isTouchFibLevel`, err)
        }
}

// const predictDirection = (price, time) => {
//         try {
//                 swingListNew.forEach((swing, index) => {

//                         const touchedFibLabel = ''

                        

//                         // Object.keys(swing.fibLevel).forEach(fibKey => {

//                         //         const inBetweenSwings = swingListNew.filter((e, ind) => ind > index)
//                         //         if (inBetweenSwings.length > 1) {

//                         //                 const noOf7Return = inBetweenSwings.filter(e => e['0.786-Touch']).length
//                         //                 const noOf6Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && e['0.618-Touch']).length
//                         //                 const noOf5Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && e['0.5-Touch']).length
//                         //                 const noOf3Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && e['0.382-Touch']).length
//                         //                 const noOf2Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && !e['0.382-Touch'] && e['0.236-Touch']).length

//                         //                 if (noOf7Return || noOf6Return || noOf5Return || noOf3Return || noOf2Return) {

//                         //                         swing[fibKey] = swing[fibKey] ? swing[fibKey] : {}
//                         //                         swing[fibKey]['isTouch'] = true


//                         //                         let isConditionMatch = false
//                         //                         if (inBetweenSwings.length === noOf7Return) {
//                         //                                 console.log(`reverse from 7, sideways market`)
//                         //                                 isConditionMatch = true

//                         //                                 swing[fibKey]['willReverser'] = true
//                         //                                 swing[fibKey]['reversalProbability'] = 100
//                         //                         }
//                         //                         if (!isConditionMatch && inBetweenSwings.length === noOf6Return) {
//                         //                                 isConditionMatch = true

//                         //                                 swing[fibKey]['willReverser'] = true
//                         //                                 swing[fibKey]['reversalProbability'] = 100
//                         //                         }


//                         //                         if (!isConditionMatch && inBetweenSwings.length === noOf5Return) {
//                         //                                 isConditionMatch = true

//                         //                                 swing[fibKey]['willReverser'] = false
//                         //                                 swing[fibKey]['reversalProbability'] = 100
//                         //                         }
//                         //                         if (!isConditionMatch && inBetweenSwings.length === noOf3Return) {
//                         //                                 isConditionMatch = true

//                         //                                 swing[fibKey]['willReverser'] = false
//                         //                                 swing[fibKey]['reversalProbability'] = 100
//                         //                         }
//                         //                         if (!isConditionMatch && inBetweenSwings.length === noOf2Return) {
//                         //                                 isConditionMatch = true

//                         //                                 swing[fibKey]['willReverser'] = false
//                         //                                 swing[fibKey]['reversalProbability'] = 100
//                         //                         }

//                         //                         if (!isConditionMatch) {

//                         //                                 const thresholdCountList = [
//                         //                                         {
//                         //                                                 label: '0.786',
//                         //                                                 count: noOf7Return
//                         //                                         },
//                         //                                         {
//                         //                                                 label: '0.618',
//                         //                                                 count: noOf6Return,
//                         //                                         },
//                         //                                         {
//                         //                                                 label: '0.5',
//                         //                                                 count: noOf5Return,
//                         //                                         },
//                         //                                         {
//                         //                                                 label: '0.382',
//                         //                                                 count: noOf3Return,
//                         //                                         },
//                         //                                         {
//                         //                                                 label: '0.236',
//                         //                                                 count: noOf2Return,
//                         //                                         }]
//                         //                                 const maximumReturnedLabel = thresholdCountList.sort((a, b) => b.count - a.count, 0)[0]

//                         //                                 console.log(`maximumReturnedLabel returned `, maximumReturnedLabel.label, maximumReturnedLabel.count, ` for swing> `, swing.direction, swing.start, swing.end, time, price)

//                         //                                 if (['0.786', '0.618'].includes(maximumReturnedLabel.label)) {

//                         //                                         swing[fibKey]['willReverser'] = true
//                         //                                         swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
//                         //                                 }
//                         //                                 if (['0.5', '0.382', '0.236'].includes(maximumReturnedLabel.label)) {

//                         //                                         swing[fibKey]['willReverser'] = false
//                         //                                         swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
//                         //                                 }
//                         //                         }



//                         //                         if (swing[fibKey]['willReverser']) {

//                         //                                 const diff = swingListNew[swingListNew.length - 1].fibLevel['0.382'] - price
//                         //                                 // if (diff > 20) {

//                         //                                 console.log(`entry check`, time, price)
//                         //                                 console.log(`Before antry list: ${entryList.length} Target: ${swingListNew[swingListNew.length - 1].fibLevel['0.382']} -- SL: `)

//                         //                                 console.log()

//                         //                                 entryList.push({
//                         //                                         // swingDirection: swing.direction,
//                         //                                         entryDirection: swing.direction,
//                         //                                         entryPrice: price,
//                         //                                         target: swingListNew[swingListNew.length - 1].fibLevel['0.382'],
//                         //                                         sl: price - diff,
//                         //                                         entryLevel: fibKey,
//                         //                                         diff,
//                         //                                         // swingDetails: swing,
//                         //                                         // sStart: swing.start,
//                         //                                         // sEnd: swing.end,

//                         //                                         inBetweenSwings: inBetweenSwings.length,
//                         //                                         probability: swing[fibKey]['reversalProbability'],
//                         //                                         entryTime: time,
//                         //                                 })
//                         //                                 // }
//                         //                         }
//                         //                 }

//                         //         }
//                         // })
//                 })
//         } catch (err) {
//                 console.error(`Error in isTouchFibLevel`, err)
//         }
// }

// const findTarget = (price, time) => {
//         entryList.forEach(entry => {
//                 if (entry.pnl) return

//                 if (entry.entryDirection === UP) {
//                         if (price >= entry.target || price < entry.sl) {
//                                 entry.pnl = price - entry.entryPrice
//                         }
//                 }

//                 if (entry.entryDirection === DOWN) {
//                         if (price <= entry.target || price > entry.sl) {
//                                 entry.pnl = entry.entryPrice - price
//                         }
//                 }
//         })
// }


newData.forEach(e => {

        findSwings(+e.price)
        checkFibLabelTouch(+e.price, e.timestamp)
        // predictDirection(+e.price, e.timestamp)
        // findTarget(+e.price, e.timestamp)

})


// console.table(swingListNew.map(e => ({ start: e.start, end: e.end, direction: e.direction })))
console.table(swingListNew)
console.table(entryList)
console.log(`swingListNew.length - `, swingListNew.length)
console.log(`entryList.length - `, entryList.length)

console.log(count)




// const chart = asciichart.plot(newData, { height: 30, width: 50 });
// console.log(chart)




function fillPriceGaps(priceArray) {

        const [timestamp, open, high, low, close, volume] = priceArray;
        const filledPrices = [];

        if (close > open) {
                // Case: open > low > high > close
                filledPrices.push(open);

                for (let i = open - 1; i > low; i--) {
                        filledPrices.push(i);
                }

                filledPrices.push(low);

                for (let i = low + 1; i < high; i++) {
                        filledPrices.push(i);
                }

                filledPrices.push(high);

                for (let i = high - 1; i > close; i--) {
                        filledPrices.push(i);
                }

                filledPrices.push(close);
        } else {
                // Case: open > high > low > close
                filledPrices.push(open);

                for (let i = open + 1; i < high; i++) {
                        filledPrices.push(i);
                }

                filledPrices.push(high);

                for (let i = high - 1; i > low; i--) {
                        filledPrices.push(i);
                }

                filledPrices.push(low);

                for (let i = low + 1; i < close; i++) {
                        filledPrices.push(i);
                }

                filledPrices.push(close);

        }

        return filledPrices;
}




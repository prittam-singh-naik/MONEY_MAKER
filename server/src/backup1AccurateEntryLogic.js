const asciichart = require('asciichart');
const { getFibRetracement, levels } = require('fib-retracement')
const data = require('./historicaldata/23_02_2024_BANKNIFTY_ONE_MINUTE')

let price = []
data.sort((a, b) => Date.parse(a[0]) - Date.parse(b[0])).forEach(e => {
        
        const filledData = fillPriceGaps(e)

        const dateString = new Date(e[0]).toLocaleTimeString()
        // const dateString = new Date( new Date(e[0]).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000 ).toLocaleTimeString()
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

const minSwingLength = 20
let direction = NEUTRAL

const findSwings = (price, time) => {

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
                                reversedFrom: [],
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
                                reversedFrom: [],
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
                        reversedFrom: [],
                })
                direction = DOWN
                low = price
                
                // swingListNew.filter(e => e.direction === direction && !e.isDeleted).forEach(swing => {

                        
                //         // if (time === '9:33:00 am' && swing.start === 47087.9) {
                //         //         console.log(price, direction, swing.direction, high, low)
                //         //         console.log(swing.lastReverseFrom, swing.fibLevel)
                //         // }
                //         if (swing.lastReverseFrom) {
                //                 swing.reversedFrom.push(swing.lastReverseFrom)
                //                 swing.lastReverseFrom = ''
                //         }
                // })
        }

        if (direction === DOWN && price > (low + minSwingLength)) {

                swingListNew.push({
                        start: low,
                        end: price,
                        direction: UP,
                        fibLevel: getFibRetracement(low, price),
                        high: price,
                        low: low,
                        reversedFrom: [],
                })
                direction = UP
                high = price

                // swingListNew.filter(e => e.direction === direction && !e.isDeleted).forEach(swing => {
                //         // if (time === '9:33:00 am' && swing.start === 47087.9) {
                //         //         console.log(price, direction, swing.direction, high, low)
                //         //         console.log(swing.lastReverseFrom, swing.fibLevel)
                //         // }
                //         if (swing.lastReverseFrom) {
                //                 swing.reversedFrom.push(swing.lastReverseFrom)
                //                 swing.lastReverseFrom = ''
                //         }
                // })
        }

        // =======END=================== ADD NEW SWING =======================END========



        // =======START=================== UPDATE SWING VALUE =======================START========
        swingListNew.forEach(swing => {
                if (swing.isDeleted) return

                if (swing.direction === UP && price > swing.high) {

                        swing.high = price
                        swing.end = price
                        swing.fibLevel = getFibRetracement(swing.low, swing.high)
                        if (swing.lastReverseFrom) {
                                swing.reversedFrom.push(swing.lastReverseFrom)
                                // swing.reversedFrom = [ ...(swing.reversedFrom ? swing.reversedFrom : []), swing.lastReverseFrom]
                                swing.lastReverseFrom = ''
                        }

                        delete swing['0.236-Touch']
                        delete swing['0.382-Touch']
                        delete swing['0.5-Touch']
                        delete swing['0.618-Touch']
                        delete swing['0.786-Touch']

                        // delete swing['0.236']
                        // delete swing['0.382']
                        // delete swing['0.5']
                        // delete swing['0.618']
                        // delete swing['0.786']

                }

                if (swing.direction === DOWN && price < swing.low) {

                        swing.low = price
                        swing.end = price
                        swing.fibLevel = getFibRetracement(swing.high, swing.low)
                        if(swing.lastReverseFrom) {
                                swing.reversedFrom.push(swing.lastReverseFrom)
                                // swing.reversedFrom = [ ...(swing.reversedFrom ? swing.reversedFrom : []), swing.lastReverseFrom]
                                swing.lastReverseFrom = ''
                        }

                        delete swing['0.236-Touch']
                        delete swing['0.382-Touch']
                        delete swing['0.5-Touch']
                        delete swing['0.618-Touch']
                        delete swing['0.786-Touch']

                        // delete swing['0.236']
                        // delete swing['0.382']
                        // delete swing['0.5']
                        // delete swing['0.618']
                        // delete swing['0.786']
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
                        
                        if (swing.isDeleted) return

                        for (let fibKey of ['1', '0.786', '0.618', '0.5', '0.382', '0.236']) {

                                if (swing[fibKey + '-Touch']) break     // no need check other small lavels, because they ware touched already

                                const lowerLevel = swing.fibLevel[fibKey] - 1
                                const upperLevel = swing.fibLevel[fibKey] + 1

                                if (swing.direction === DOWN && price >= lowerLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true
                                        swing.lastReverseFrom = fibKey
                                        break
                                }

                                if (swing.direction === UP && price <= upperLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true
                                        swing.lastReverseFrom = fibKey
                                        break
                                }
                        }
                })
        } catch (err) {
                console.error(`Error in isTouchFibLevel`, err)
        }
}

const predictDirection = (price, time) => {
        try {
                swingListNew.forEach((swing, index) => {
                        
                        const fibKey = '0.786'

                        if (swing.isDeleted || !swing[fibKey + '-Touch'] || swing[fibKey + '-Entry'])    return

                        const inBetweenSwings = swingListNew.filter((e, ind) => ind > index && !e.isDeleted && (e.direction != swing.direction))

                        swing[fibKey + '-Entry'] = true


                        if (inBetweenSwings.length > 1) {


                                let reversedLevels = []
                                inBetweenSwings.forEach(e => reversedLevels = [ ...reversedLevels, ...(e.reversedFrom || []) ])

                               

                                // if (reversedLevels.includes('0.786') ) {
                                
                                const lastReverseFrom = reversedLevels[reversedLevels.length - 1]
                                // const swingLastReverseFrom = swing.reversedFrom[swing.reversedFrom.length - 1]


                        // if (swing.start === 47363.4 && time === '9:44:00 am') {
                        //         // count++
                        //         console.log(swingLastReverseFrom)
                        //         console.log(swing.lastReverseFrom != '0.618', swing.lastReverseFrom, '0.618')
                        // }

                                if (reversedLevels.includes('0.786') && lastReverseFrom != '0.236' && reversedLevels.length < 10) {
                                        
                                        // swing[fibKey + '-Entry'] = true

                                        // if (swing.start === 47363.4 && time === '9:44:00 am') {
                                                // count++
                                                // console.log(swing.reversedFrom, swing.lastReverseFrom, time)
                                                // console.log('--', inBetweenSwings.length, time, swing['0.786-Touch'], swing.start, swing.end, price)
                                                // console.log(inBetweenSwings[0]?.start, inBetweenSwings[0]?.end, inBetweenSwings[0]?.direction, inBetweenSwings[0]?.reversedFrom)
                                                // console.log(inBetweenSwings[1]?.start, inBetweenSwings[1]?.end, inBetweenSwings[1]?.direction, inBetweenSwings[1]?.reversedFrom)
                                                // console.log(inBetweenSwings[2]?.start, inBetweenSwings[2]?.end, inBetweenSwings[2]?.direction, inBetweenSwings[2]?.reversedFrom)
                                                // console.log(inBetweenSwings[3]?.start, inBetweenSwings[3]?.end, inBetweenSwings[3]?.direction, inBetweenSwings[3]?.reversedFrom)
                                                // console.log(inBetweenSwings[4]?.start, inBetweenSwings[4]?.end, inBetweenSwings[4]?.direction, inBetweenSwings[4]?.reversedFrom)
                                                // console.log(reversedLevels, time)


                                                const diff = Math.abs(swingListNew[swingListNew.length - 1].fibLevel['0.382'] - price)

                                                entryList.push({
                                                        // swingDirection: swing.direction,
                                                        entryDirection: swing.direction,
                                                        entryPrice: price,
                                                        target: swingListNew[swingListNew.length - 1].fibLevel['0.382'],
                                                        sl: swing.direction === DOWN ? price + diff : price - diff,
                                                        entryLevel: fibKey,
                                                        // diff,
                                                        // swingDetails: swing,
                                                        sStart: swing.start,
                                                        sEnd: swing.end,

                                                        inBetweenSwings: inBetweenSwings.length,
                                                        // probability: swing[fibKey]['reversalProbability'],
                                                        entryTime: time,
                                                        // reversedLevels,
                                                })


                                        // }

                                }

                        }

                })
        } catch (err) {
                console.error(`Error in isTouchFibLevel`, err)
        }
}

const findTarget = (price, time) => {
        entryList.forEach(entry => {
                if (entry.pnl) return

                if (entry.entryDirection === UP) {
                        if (price >= entry.target || price < entry.sl) {
                                entry.pnl = price - entry.entryPrice
                        }
                }

                if (entry.entryDirection === DOWN) {
                        if (price <= entry.target || price > entry.sl) {
                                entry.pnl = entry.entryPrice - price
                        }
                }
        })
}


newData.forEach(e => {
        
        findSwings(+e.price, e.timestamp)
        checkFibLabelTouch(+e.price, e.timestamp)
        predictDirection(+e.price, e.timestamp)
        findTarget(+e.price, e.timestamp)

})


// console.table(swingListNew.map(e => ({ start: e.start, end: e.end, direction: e.direction })))
// console.table(swingListNew)
console.table(entryList)
// console.table(entryList.map(e => ({pnl: e.pnl, reversedLevels: JSON.stringify(e.reversedLevels)})))
console.log(`swingListNew.length - `, swingListNew.length)
console.log(`entryList.length - `, entryList.length)
const pnl = entryList.reduce((a, b) =>  a + +b.pnl, 0)
console.log(`PNL - `, pnl)


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




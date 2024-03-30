// const data = [46215,46219,46210,46211,46221,46221,46211,46217,46210,46210,46210,46210,46207,46207,46213,46213,46214,46208,46208,46214,46210,46210,46210,46210,46210,46207,46207,46210,46209,46204,46204,46202,46209,46203,46203,46203,46203,46205,46205,46205,46204,46204,46204,46204,46204,46201,46201,46201,46199,46196,46196,46199,46199,46195,46190,46191,46191,46191,46190,46190,46189,46189,46194,46194,46194,46194,46194,46196,46196,46196,46196,46196,46196,46197,46199,46199,46203,46207,46200,46200,46200,46200,46201,46201,46197,46197,46202,46202,46201,46201,46201,46204,46206,46206,46204,46204,46202,46202,46202,46205,46205,46202,46204,46205,46205,46205,46207,46205,46205,46203,46203,46202,46203,46204,46204,46204,46202,46202,46207,46207,46202,46202,46202,46198,46198,46198,46200,46200,46199,46199,46199,46204,46204,46204,46204,46205,46203,46203,46203,46208]

const asciichart = require('asciichart');
const { getFibRetracement, levels } = require('fib-retracement')


const data = require('./livedata/19Jan2024')

const price = data.priceAndTimestamps.sort((a, b) => a.time.$numberLong - b.time.$numberLong).map(e => ({ price: e.price.substring(0, e.price.length - 2), time: new Date(parseInt(e.time.$numberLong)).toLocaleString() }))

const newData = price.map(e => e.price)

// const newData = [46215,46219,46210,46211,46221,46221,46211,46217,46210,46210,46210,46210,46207,46207,46213,46213,46214,46208,46208,46214,46210,46210,46210,46210,46210,46207,46207,46210,46209,46204,46204,46202,46209,46203,46203,46203,46203,46205,46205,46205,46204,46204,46204,46204,46204,46201,46201,46201,46199,46196,46196,46199,46199,46195,46190,46191,46191,46191,46190,46190,46189,46189,46194,46194,46194,46194,46194,46196,46196,46196,46196,46196,46196,46197,46199,46199,46203,46207,46200,46200,46200,46200,46201,46201,46197,46197,46202,46202,46201,46201,46201,46204,46206,46206,46204,46204,46202,46202,46202,46205,46205,46202,46204,46205,46205,46205,46207,46205,46205,46203,46203,46202,46203,46204,46204,46204,46202,46202,46207,46207,46202,46202,46202,46198,46198,46198,46200,46200,46199,46199,46199,46204,46204,46204,46204,46205,46203,46203,46203,46208]
// const newData = [50, 40, 30, 
//         21, 15, 10, 
//         20, 20, 20,
//         20, 30, 40, 30, 40, 50, 60, 80, 
//         70, 85, 90, 92, 94, 96, 98, 100, 
//         98, 96, 94, 91, 90, 85, 80, 70, 68, 65, 
//         80, 
//         60, 40
// ]



let startingPoint = 0

const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

let swingListNew = []

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
        const indexListToDelete = []
        swingListNew.forEach((e, index) => {

                if (e.direction === UP && price <= (e.start + 1)) indexListToDelete.push(index)

                if (e.direction === DOWN && price >= (e.start - 1)) indexListToDelete.push(index)
        })
        indexListToDelete.sort((a, b) => b - a, 0).forEach(e => {
                swingListNew.splice(e, 1)
        })


}


const entryList = []

const findEntry = (price) => {
        try {
                // const currentSwingFibLevel = direction === UP ? getFibRetracement(low, high) : getFibRetracement(high, low)

                swingListNew.forEach((swing, index) => {

                        Object.keys(swing.fibLevel).forEach(fibKey => {

                                const lowerLevel = swing.fibLevel[fibKey] - 1
                                const upperLevel = swing.fibLevel[fibKey] + 1

                                if (swing.direction === DOWN && price >= lowerLevel && !swingListNew[index][fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true

                                        const inBetweenSwings = swingListNew.filter((e, ind) => ind > index)
                                        if (inBetweenSwings.length) {

                                                const noOf7Return = inBetweenSwings.filter(e => e['0.786-Touch']).length
                                                const noOf6Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && e['0.618-Touch']).length
                                                const noOf5Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && e['0.5-Touch']).length
                                                const noOf3Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && e['0.382-Touch']).length
                                                const noOf2Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && !e['0.382-Touch'] && e['0.236-Touch']).length

                                                if (noOf7Return || noOf6Return || noOf5Return || noOf3Return || noOf2Return) {

                                                        swing[fibKey] = swing[fibKey] ? swing[fibKey] : {}
                                                        swing[fibKey]['isTouch'] = true

                                                        let isConditionMatch = false
                                                        if (inBetweenSwings.length === noOf7Return) {
                                                                console.log(`reverse from 7, sideways market`)
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = true
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf6Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = true
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }


                                                        if (!isConditionMatch && inBetweenSwings.length === noOf5Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf3Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf2Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }

                                                        if (!isConditionMatch) {

                                                                const thresholdCountList = [
                                                                        {
                                                                                label: '0.786',
                                                                                count: noOf7Return
                                                                        },
                                                                        {
                                                                                label: '0.618',
                                                                                count: noOf6Return,
                                                                        },
                                                                        {
                                                                                label: '0.5',
                                                                                count: noOf5Return,
                                                                        },
                                                                        {
                                                                                label: '0.382',
                                                                                count: noOf3Return,
                                                                        },
                                                                        {
                                                                                label: '0.236',
                                                                                count: noOf2Return,
                                                                        }]
                                                                const maximumReturnedLabel = thresholdCountList.sort((a, b) => b.count - a.count, 0)[0]

                                                                console.log(`maximumReturnedLabel returned `, maximumReturnedLabel.label, maximumReturnedLabel.count, ` for swing> `, swing.direction, swing.start, swing.end)

                                                                if (['0.786', '0.618'].includes(maximumReturnedLabel.label)) {

                                                                        swing[fibKey]['willReverser'] = true
                                                                        swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
                                                                }
                                                                if (['0.5', '0.382', '0.236'].includes(maximumReturnedLabel.label)) {

                                                                        swing[fibKey]['willReverser'] = false
                                                                        swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
                                                                }
                                                        }

                                                        if (swing[fibKey]['willReverser']) {

                                                                entryList.push({
                                                                        swingDirection: swing.direction,
                                                                        entryDirection: DOWN,
                                                                        entryOn: price,
                                                                        // target: currentSwingFibLevel['0.382'],
                                                                        // sl: currentSwingFibLevel['0'],
                                                                        entryLevel: fibKey,
                                                                        swingDetails: swing,
                                                                        sStart: swing.start,
                                                                        sEnd: swing.end,
                                                                        // sThreadhold: swing.threshold,

                                                                        inBetweenSwings: inBetweenSwings.length,
                                                                        probability: swing[fibKey]['reversalProbability'],
                                                                })
                                                        }
                                                }
                                        }

                                }

                                if (swing.direction === UP && price <= upperLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true

                                        const inBetweenSwings = swingListNew.filter((e, ind) => ind > index)
                                        if (inBetweenSwings.length) {

                                                // if (fibKey === '0.786' && swing.start  ===  9 && swing.end === 40) {

                                                const noOf7Return = inBetweenSwings.filter(e => e['0.786-Touch']).length
                                                const noOf6Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && e['0.618-Touch']).length
                                                const noOf5Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && e['0.5-Touch']).length
                                                const noOf3Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && e['0.382-Touch']).length
                                                const noOf2Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && !e['0.382-Touch'] && e['0.236-Touch']).length

                                                if (noOf7Return || noOf6Return || noOf5Return || noOf3Return || noOf2Return) {

                                                        swing[fibKey] = swing[fibKey] ? swing[fibKey] : {}
                                                        swing[fibKey]['isTouch'] = true


                                                        let isConditionMatch = false
                                                        if (inBetweenSwings.length === noOf7Return) {
                                                                console.log(`reverse from 7, sideways market`)
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = true
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf6Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = true
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }


                                                        if (!isConditionMatch && inBetweenSwings.length === noOf5Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf3Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf2Return) {
                                                                isConditionMatch = true

                                                                swing[fibKey]['willReverser'] = false
                                                                swing[fibKey]['reversalProbability'] = 100
                                                        }

                                                        if (!isConditionMatch) {

                                                                const thresholdCountList = [
                                                                        {
                                                                                label: '0.786',
                                                                                count: noOf7Return
                                                                        },
                                                                        {
                                                                                label: '0.618',
                                                                                count: noOf6Return,
                                                                        },
                                                                        {
                                                                                label: '0.5',
                                                                                count: noOf5Return,
                                                                        },
                                                                        {
                                                                                label: '0.382',
                                                                                count: noOf3Return,
                                                                        },
                                                                        {
                                                                                label: '0.236',
                                                                                count: noOf2Return,
                                                                        }]
                                                                const maximumReturnedLabel = thresholdCountList.sort((a, b) => b.count - a.count, 0)[0]

                                                                console.log(`maximumReturnedLabel returned `, maximumReturnedLabel.label, maximumReturnedLabel.count, ` for swing> `, swing.direction, swing.start, swing.end)

                                                                if (['0.786', '0.618'].includes(maximumReturnedLabel.label)) {

                                                                        swing[fibKey]['willReverser'] = true
                                                                        swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
                                                                }
                                                                if (['0.5', '0.382', '0.236'].includes(maximumReturnedLabel.label)) {

                                                                        swing[fibKey]['willReverser'] = false
                                                                        swing[fibKey]['reversalProbability'] = ((maximumReturnedLabel.count / inBetweenSwings.length) * 100).toFixed(2) + ' %'
                                                                }
                                                        }


                                                        // }

                                                        if (swing[fibKey]['willReverser']) {

                                                                entryList.push({
                                                                        swingDirection: swing.direction,
                                                                        entryDirection: UP,
                                                                        entryOn: price,
                                                                        // target: currentSwingFibLevel['0.382'],
                                                                        // sl: currentSwingFibLevel['0'],
                                                                        entryLevel: fibKey,
                                                                        swingDetails: swing,
                                                                        sStart: swing.start,
                                                                        sEnd: swing.end,
                                                                        // sThreadhold: swing.threshold,

                                                                        inBetweenSwings: inBetweenSwings.length,
                                                                        probability: swing[fibKey]['reversalProbability'],
                                                                })
                                                        }
                                                }
                                        }

                                }
                        })
                })
        } catch (err) {
                console.error(`Error in isTouchFibLevel`, err)
        }
}


newData.forEach(price => {

        findSwings(+price)
        findEntry(+price)

})


// console.table(swingListNew)
// console.table(entryList)
// console.log(`swingListNew.length - `, swingListNew.length)
// console.log(`entryList.length - `, entryList.length)






// const chart = asciichart.plot(newData, { height: 30, width: 50 });
// console.log(chart)






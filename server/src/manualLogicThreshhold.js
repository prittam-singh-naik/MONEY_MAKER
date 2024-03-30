// const data = [46215,46219,46210,46211,46221,46221,46211,46217,46210,46210,46210,46210,46207,46207,46213,46213,46214,46208,46208,46214,46210,46210,46210,46210,46210,46207,46207,46210,46209,46204,46204,46202,46209,46203,46203,46203,46203,46205,46205,46205,46204,46204,46204,46204,46204,46201,46201,46201,46199,46196,46196,46199,46199,46195,46190,46191,46191,46191,46190,46190,46189,46189,46194,46194,46194,46194,46194,46196,46196,46196,46196,46196,46196,46197,46199,46199,46203,46207,46200,46200,46200,46200,46201,46201,46197,46197,46202,46202,46201,46201,46201,46204,46206,46206,46204,46204,46202,46202,46202,46205,46205,46202,46204,46205,46205,46205,46207,46205,46205,46203,46203,46202,46203,46204,46204,46204,46202,46202,46207,46207,46202,46202,46202,46198,46198,46198,46200,46200,46199,46199,46199,46204,46204,46204,46204,46205,46203,46203,46203,46208]

const asciichart = require('asciichart');
const { getFibRetracement, levels } = require('fib-retracement')

// const newData = [46215,46219,46210,46211,46221,46221,46211,46217,46210,46210,46210,46210,46207,46207,46213,46213,46214,46208,46208,46214,46210,46210,46210,46210,46210,46207,46207,46210,46209,46204,46204,46202,46209,46203,46203,46203,46203,46205,46205,46205,46204,46204,46204,46204,46204,46201,46201,46201,46199,46196,46196,46199,46199,46195,46190,46191,46191,46191,46190,46190,46189,46189,46194,46194,46194,46194,46194,46196,46196,46196,46196,46196,46196,46197,46199,46199,46203,46207,46200,46200,46200,46200,46201,46201,46197,46197,46202,46202,46201,46201,46201,46204,46206,46206,46204,46204,46202,46202,46202,46205,46205,46202,46204,46205,46205,46205,46207,46205,46205,46203,46203,46202,46203,46204,46204,46204,46202,46202,46207,46207,46202,46202,46202,46198,46198,46198,46200,46200,46199,46199,46199,46204,46204,46204,46204,46205,46203,46203,46203,46208]
const newData = [50, 40, 30, 
        21, 15, 10, 
        20, 20, 20,
        20, 30, 40, 30, 40, 50, 60, 80, 
        70, 85, 90, 92, 94, 96, 98, 100, 
        98, 96, 94, 91, 90, 85, 80, 70, 68, 65, 
        80, 
        60, 40,8
]



let startingPoint = 0

const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

const thresholdList = {
        2: { direction: NEUTRAL, swings: [] },
        5: { direction: NEUTRAL, swings: [] },
        10: { direction: NEUTRAL, swings: [] },
        15: { direction: NEUTRAL, swings: [] },
        20: { direction: NEUTRAL, swings: [] },
        23: { direction: NEUTRAL, swings: [] },
        27: { direction: NEUTRAL, swings: [] },
        30: { direction: NEUTRAL, swings: [] },
        34: { direction: NEUTRAL, swings: [] },
        39: { direction: NEUTRAL, swings: [] },
        43: { direction: NEUTRAL, swings: [] },
        45: { direction: NEUTRAL, swings: [] },
        50: { direction: NEUTRAL, swings: [] },
}
let swingListNew = []

const findSwings = (price, threshold) => {

        if (!thresholdList[threshold].low && !thresholdList[threshold].high) thresholdList[threshold].low = thresholdList[threshold].high = thresholdList[threshold].startingPoint = price


        // =======START=================== SET INITIAL SWING ----- CALCULATE FROM STARTING POINT =======================START========
        if ( thresholdList[threshold].direction === NEUTRAL) {
                if (price > ( thresholdList[threshold].startingPoint + threshold )) {

                        swingListNew.push({
                                start: thresholdList[threshold].low,
                                end: thresholdList[threshold].high,
                                low: thresholdList[threshold].low,
                                high: thresholdList[threshold].high,
                                direction: UP,
                                threshold,
                                fibLevel: getFibRetracement(thresholdList[threshold].low, thresholdList[threshold].high),
                        })
                        thresholdList[threshold].direction = UP
                }
                if (price < ( thresholdList[threshold].startingPoint - threshold )) {

                        swingListNew.push({
                                start: thresholdList[threshold].high,
                                end: thresholdList[threshold].low,
                                high: thresholdList[threshold].high,
                                low: thresholdList[threshold].low,
                                direction: DOWN,
                                threshold,
                                fibLevel: getFibRetracement(thresholdList[threshold].high, thresholdList[threshold].low),
                        })

                        thresholdList[threshold].direction = DOWN
                }

                thresholdList[threshold].high = price > thresholdList[threshold].high ? price : thresholdList[threshold].high
                thresholdList[threshold].low = price < thresholdList[threshold].low ? price : thresholdList[threshold].low
        }
        // =======END=================== SET INITIAL SWING ----- CALCULATE FROM STARTING POINT =======================END========



        
        const index = swingListNew.findLastIndex(e => e.threshold === threshold)
        if (index < 0) return
        
        // =======START=================== UPDATE SWING VALUE =======================START========
        if ( swingListNew[index].direction === UP && price > swingListNew[index].high ) {
                
                swingListNew[index].high = price
                swingListNew[index].end = price
                swingListNew[index].fibLevel = getFibRetracement(swingListNew[index].low, swingListNew[index].high)
        }

        if ( swingListNew[index].direction === DOWN && price < swingListNew[index].low ) {

                swingListNew[index].low = price
                swingListNew[index].end = price
                swingListNew[index].fibLevel = getFibRetracement(swingListNew[index].high, swingListNew[index].low)
        }
        // =======END=================== UPDATE SWING VALUE =======================END========





        // =======START=================== ADD NEW SWING =======================START========

        if ( swingListNew[index].direction === UP && price < ( swingListNew[index].high - threshold ) ) {

                swingListNew.push({
                        start: swingListNew[index].high,
                        end: price,
                        direction: DOWN,
                        threshold,
                        fibLevel: getFibRetracement(swingListNew[index].high, price),
                        low: price,
                        high: swingListNew[index].high,
                })
        }

        if ( swingListNew[index].direction === DOWN && price > ( swingListNew[index].low + threshold ) ) {

                console.log(price, threshold)
                swingListNew.push({
                        start: swingListNew[index].low,
                        end: price,
                        direction: UP,
                        threshold,
                        fibLevel: getFibRetracement(swingListNew[index].low, price),
                        high: price,
                        low: swingListNew[index].low,
                })
        }

        // =======END=================== ADD NEW SWING =======================END========



        


        // Delete unnessery swings those are convered 100%
        const indexListToDelete = []
        swingListNew.forEach( (e, index) => {

                if ( !(e.threshold === threshold) ) return

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
                                        
                                        swingListNew[index][fibKey + '-Touch'] = true
                                        
                                        const inBetweenSwings = swingListNew.filter((e, ind) => ind > index)
                                        if (inBetweenSwings.length) {
                                                
                                                const noOf7Return = inBetweenSwings.filter(e => e['0.786-Touch']).length
                                                const noOf6Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && e['0.618-Touch']).length
                                                const noOf5Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && e['0.5-Touch']).length
                                                const noOf3Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && e['0.382-Touch']).length
                                                const noOf2Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && !e['0.382-Touch'] && e['0.236-Touch']).length

                                                swingListNew[index][fibKey] = swingListNew[index][fibKey] ? swingListNew[index][fibKey] : {}
                                                swingListNew[index][fibKey]['isTouch'] = true


                                                let isConditionMatch = false
                                                if (inBetweenSwings.length === noOf7Return) {
                                                        console.log(`reverse from 7, sideways market`)
                                                        isConditionMatch = true

                                                        swingListNew[index][fibKey]['willReverser'] = true
                                                        swingListNew[index][fibKey]['reversalProbability'] = 100
                                                }
                                                if (!isConditionMatch && inBetweenSwings.length === noOf6Return) {
                                                        isConditionMatch = true

                                                        swingListNew[index][fibKey]['willReverser'] = true
                                                        swingListNew[index][fibKey]['reversalProbability'] = 100
                                                }


                                                if (!isConditionMatch && inBetweenSwings.length === noOf5Return) {
                                                        isConditionMatch = true

                                                        swingListNew[index][fibKey]['willReverser'] = false
                                                        swingListNew[index][fibKey]['reversalProbability'] = 100
                                                }
                                                if (!isConditionMatch && inBetweenSwings.length === noOf3Return) {
                                                        isConditionMatch = true

                                                        swingListNew[index][fibKey]['willReverser'] = false
                                                        swingListNew[index][fibKey]['reversalProbability'] = 100
                                                }
                                                if (!isConditionMatch && inBetweenSwings.length === noOf2Return) {
                                                        isConditionMatch = true

                                                        swingListNew[index][fibKey]['willReverser'] = false
                                                        swingListNew[index][fibKey]['reversalProbability'] = 100
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
                                                        console.log(`maximumReturnedLabel:: `, maximumReturnedLabel)
                                                        if (['0.786', '0.618'].includes(maximumReturnedLabel.label)) {

                                                                swingListNew[index][fibKey]['willReverser'] = true
                                                                swingListNew[index][fibKey]['reversalProbability'] = (inBetweenSwings.length / maximumReturnedLabel.count) * 100
                                                        }
                                                        if (['0.5', '0.382', '0.236'].includes(maximumReturnedLabel.label)) {

                                                                swingListNew[index][fibKey]['willReverser'] = false
                                                                swingListNew[index][fibKey]['reversalProbability'] = (inBetweenSwings.length / maximumReturnedLabel.count) * 100
                                                        }
                                                }

                                                if (swingListNew[index][fibKey]['willReverser']) {

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
                                                                sThreadhold: swing.threshold,

                                                                inBetweenSwings: inBetweenSwings.length,
                                                                probability: swingListNew[index][fibKey]['reversalProbability'],
                                                        })
                                                }
                                        }

                                }
                                
                                if (swing.direction === UP && price <= upperLevel && !swingListNew[index][fibKey + '-Touch']) {
                                        
                                swingListNew[index][fibKey + '-Touch'] = true
                                        
                                        const inBetweenSwings = swingListNew.filter((e, ind) => ind > index)
                                        if (inBetweenSwings.length) {
                                                
                                                // if (fibKey === '0.786' && swingListNew[index].start  ===  9 && swingListNew[index].end === 40) {
                                                        
                                                        const noOf7Return = inBetweenSwings.filter(e => e['0.786-Touch']).length
                                                        const noOf6Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && e['0.618-Touch']).length
                                                        const noOf5Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && e['0.5-Touch']).length
                                                        const noOf3Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && e['0.382-Touch']).length
                                                        const noOf2Return = inBetweenSwings.filter(e => !e['0.786-Touch'] && !e['0.618-Touch'] && !e['0.5-Touch'] && !e['0.382-Touch'] && e['0.236-Touch']).length

                                                        swingListNew[index][fibKey] = swingListNew[index][fibKey] ? swingListNew[index][fibKey] : {}
                                                        swingListNew[index][fibKey]['isTouch'] = true


                                                        let isConditionMatch = false
                                                        if (inBetweenSwings.length === noOf7Return) {
                                                                console.log(`reverse from 7, sideways market`)
                                                                isConditionMatch = true

                                                                swingListNew[index][fibKey]['willReverser'] = true
                                                                swingListNew[index][fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf6Return) {
                                                                isConditionMatch = true

                                                                swingListNew[index][fibKey]['willReverser'] = true
                                                                swingListNew[index][fibKey]['reversalProbability'] = 100
                                                        }


                                                        if (!isConditionMatch && inBetweenSwings.length === noOf5Return) {
                                                                isConditionMatch = true

                                                                swingListNew[index][fibKey]['willReverser'] = false
                                                                swingListNew[index][fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf3Return) {
                                                                isConditionMatch = true

                                                                swingListNew[index][fibKey]['willReverser'] = false
                                                                swingListNew[index][fibKey]['reversalProbability'] = 100
                                                        }
                                                        if (!isConditionMatch && inBetweenSwings.length === noOf2Return) {
                                                                isConditionMatch = true

                                                                swingListNew[index][fibKey]['willReverser'] = false
                                                                swingListNew[index][fibKey]['reversalProbability'] = 100
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
                                                                console.log(`maximumReturnedLabel:: `, maximumReturnedLabel)
                                                                if (['0.786', '0.618'].includes(maximumReturnedLabel.label)) {

                                                                        swingListNew[index][fibKey]['willReverser'] = true
                                                                        swingListNew[index][fibKey]['reversalProbability'] = (inBetweenSwings.length / maximumReturnedLabel.count) * 100
                                                                }
                                                                if (['0.5', '0.382', '0.236'].includes(maximumReturnedLabel.label)) {

                                                                        swingListNew[index][fibKey]['willReverser'] = false
                                                                        swingListNew[index][fibKey]['reversalProbability'] = (inBetweenSwings.length / maximumReturnedLabel.count) * 100
                                                                }
                                                        }


                                                // }

                                                if (swingListNew[index][fibKey]['willReverser']) {

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
                                                                sThreadhold: swing.threshold,

                                                                inBetweenSwings: inBetweenSwings.length,
                                                                probability: swingListNew[index][fibKey]['reversalProbability'],
                                                        })
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

        Object.keys(thresholdList).forEach(threshold => {
                
                findSwings(+price)
        })
        findEntry(+price)

})

// swingListNew = swingListNew.filter(e => e.threshold)



console.table(swingListNew)
console.log(swingListNew.length)






const chart = asciichart.plot(newData, { height: 30, width: 50 });
console.log(chart)


// console.table(entryList)
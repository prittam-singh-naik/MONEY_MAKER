
const asciichart = require('asciichart');
const { getFibRetracement, levels } = require('fib-retracement')

const chartData = [9, 40, 28, 38, 23, 35, 16, 26,
         11, 23, 18, 30, 26, 36
        ]

const newData = [];


for (let i = 0; i < chartData.length - 1; i++) {
        const start = chartData[i];
        const end = chartData[i + 1];

        if (start < end) {
                // Incrementing sequence
                for (let j = start; j <= end; j++) {
                        newData.push(j);
                }
        } else if (start > end) {
                // Decrementing sequence
                for (let j = start; j >= end; j--) {
                        newData.push(j);
                }
        } else {
                // Equal values, just push one of them
                newData.push(start);
        }
}

// console.log(newData);
// console.log(chartData)






let startingPoint = 0

const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

let low = 0
let high = 0
let direction = NEUTRAL

const swingList10 = []
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

        if (!low && !high) low = high = startingPoint = price

        if ( thresholdList[threshold].direction === NEUTRAL) {
                direction = thresholdList[threshold].direction = price > ( startingPoint + threshold ) ? UP : price < ( startingPoint - threshold ) ? DOWN : thresholdList[threshold].direction
        }

        if ( thresholdList[threshold].direction === UP && price < ( high - threshold ) ) {

                swingListNew.push({ 
                        start: low, 
                        end: high, 
                        direction: thresholdList[threshold].direction, 
                        threshold, 
                        fibLevel: getFibRetracement(low, high), 
                })
                
                low = price
                direction = thresholdList[threshold].direction = DOWN
        }

        if ( thresholdList[threshold].direction === DOWN && price > ( low + threshold ) ) {

                swingListNew.push({ 
                        start: high, 
                        end: low, 
                        direction: thresholdList[threshold].direction, 
                        threshold, 
                        fibLevel: getFibRetracement(high, low), 
                })
                
                direction = thresholdList[threshold].direction = UP
                high = price
        }








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

        high = price > high ? price : high
        low = price < low ? price : low
}

const entryList = []

const findEntry = (price) => {
        try {
                const currentSwingFibLevel = direction === UP ? getFibRetracement(low, high) : getFibRetracement(high, low)
                
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
                                                                target: currentSwingFibLevel['0.382'],
                                                                sl: currentSwingFibLevel['0'],
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
                                                                target: currentSwingFibLevel['0.382'],
                                                                sl: currentSwingFibLevel['0'],
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
                
                findSwings(+price, +threshold)
                findEntry(+price)
        })

})

// Object.keys(thresholdList).forEach(threshold => {

//         // thresholdList[threshold].swings.push(thresholdList[threshold].direction === UP ? { start: low, end: high, direction: thresholdList[threshold].direction } : { start: high, end: low, direction: thresholdList[threshold].direction } )
//         swingListNew.push(thresholdList[threshold].direction === UP ? { start: low, end: high, direction: thresholdList[threshold].direction, threshold } : { start: high, end: low, direction: thresholdList[threshold].direction, threshold } )
//         thresholdList[threshold].length = thresholdList[threshold].swings.length
// })

swingListNew = swingListNew.filter(e => e.threshold)



console.table(swingListNew)
console.log(swingListNew.length)






const chart = asciichart.plot(newData, { height: 30, width: 50 });
console.log(chart)


console.table(entryList)
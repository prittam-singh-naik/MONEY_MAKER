const data = [46215,46219,46210,46211,46221,46221,46211,46217,46210,46210,46210,46210,46207,46207,46213,46213,46214,46208,46208,46214,46210,46210,46210,46210,46210,46207,46207,46210,46209,46204,46204,46202,46209,46203,46203,46203,46203,46205,46205,46205,46204,46204,46204,46204,46204,46201,46201,46201,46199,46196,46196,46199,46199,46195,46190,46191,46191,46191,46190,46190,46189,46189,46194,46194,46194,46194,46194,46196,46196,46196,46196,46196,46196,46197,46199,46199,46203,46207,46200,46200,46200,46200,46201,46201,46197,46197,46202,46202,46201,46201,46201,46204,46206,46206,46204,46204,46202,46202,46202,46205,46205,46202,46204,46205,46205,46205,46207,46205,46205,46203,46203,46202,46203,46204,46204,46204,46202,46202,46207,46207,46202,46202,46202,46198,46198,46198,46200,46200,46199,46199,46199,46204,46204,46204,46204,46205,46203,46203,46203,46208]

// data.forEach( e => {
//         console.log(e)
// })

const { getFibRetracement, levels } = require('fib-retracement');
// const fib = getFibRetracement(0, 10);
// console.log(fib)



// const data = [112, 125, 120, 122, 120, 115, 125, 128, 120, 119, 125, 130, 150, 155, 170, 150, 140, 120, 110, 90, 50, 70, 80, 110, 150, 200, 288, 277, 255, 210, 220, 190, 150];







// const swingList10 = []

// let startingPoint = 0

// const threshold = 5

// let low = 0
// let high = 0

// const UP = 'UP'
// const DOWN = 'DOWN'
// const NEUTRAL = 'NEUTRAL'

// let direction = NEUTRAL

// function findSwings(price) {

//         if (!low && !high) low = high = startingPoint = price

//         high = price > high ? price : high
//         low = price < low ? price : low

//         if ( direction === NEUTRAL) {
//                 direction =  price > ( startingPoint + threshold ) ? UP : price < ( startingPoint - threshold ) ? DOWN : direction
//         }


//         if ( direction === UP && price < ( high - threshold ) ) {
                
//                 swingList10.push({ start: low, end: high, direction })
                
//                 low = price
//                 direction = DOWN
//         }
//         if ( direction === DOWN && price > ( low + threshold ) ) {

//                 swingList10.push({ start: high, end: low, direction })
                
//                 direction = UP
//                 high = price
//         }

// }


// data.forEach(price => {

//         findSwings(price)

// })

// swingList10.push(direction === UP ? { start: low, end: high, direction } : { start: high, end: low, direction } )
// console.log(swingList10)
// console.log(low, high)
























let startingPoint = 0

let low = 0
let high = 0

const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

const swingList10 = []
const thresholdList = {
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
const swingListNew = []

function findSwings(price, threshold) {

        if (!low && !high) low = high = startingPoint = price

        high = price > high ? price : high
        low = price < low ? price : low

        if ( thresholdList[threshold].direction === NEUTRAL) {
                thresholdList[threshold].direction = price > ( startingPoint + threshold ) ? UP : price < ( startingPoint - threshold ) ? DOWN : thresholdList[threshold].direction
        }


        if ( thresholdList[threshold].direction === UP && price < ( high - threshold ) ) {
                
                thresholdList[threshold].swings.push({ start: low, end: high, direction: thresholdList[threshold].direction })

                swingListNew.push({ start: low, end: high, direction: thresholdList[threshold].direction, threshold, fibLevel: getFibRetracement(low, high) })
                
                low = price
                thresholdList[threshold].direction = DOWN
        }
        if ( thresholdList[threshold].direction === DOWN && price > ( low + threshold ) ) {

                thresholdList[threshold].swings.push({ start: high, end: low, direction: thresholdList[threshold].direction })

                swingListNew.push({ start: high, end: low, direction: thresholdList[threshold].direction, threshold, fibLevel: getFibRetracement(high, low) })
                
                thresholdList[threshold].direction = UP
                high = price
        }

}

function findFibLevel(threshold) {
        try {
                thresholdList[threshold].swings.forEach((swing, index) => {

                        const fib = getFibRetracement(swing.start, swing.end)
                        swing.fibLevel = fib
                })
                
        } catch (err) {
                console.error(`Error while finding fib level`, err)
        }
}

function isTouchFibLevel(threshold, price) {
        try {
                const swings = thresholdList[threshold].swings

                swings.forEach(swing => {
                        Object.keys(swing.fibLevel).forEach(fibKey => {

                                const lowerLevel = swing.fibLevel[fibKey] - 2
                                const upperLevel = swing.fibLevel[fibKey] + 2

                                if (swing.direction === DOWN && price >= lowerLevel) {
                                        swing.fibLevel[fibKey + '-Touch'] = true
                                }

                                if (swing.direction === UP && price <= upperLevel) {
                                        swing.fibLevel[fibKey + '-Touch'] = true
                                }
                        })
                })
                
                swingListNew.forEach((swing, index) => {
                        Object.keys(swing.fibLevel).forEach(fibKey => {

                                const lowerLevel = swing.fibLevel[fibKey] - 2
                                const upperLevel = swing.fibLevel[fibKey] + 2

                                if (swing.direction === DOWN && price >= lowerLevel) {
                                        swingListNew[index][fibKey + '-Touch'] = true
                                }

                                if (swing.direction === UP && price <= upperLevel) {
                                        swingListNew[index][fibKey + '-Touch'] = true
                                }
                        })
                })
        } catch (err) {
                console.error(`Error in isTouchFibLevel`, err)
        }
}
function findTrend() {
        try {
                // Object.keys(thresholdList).forEach(key => {
                //         console.log(key, thresholdList[key])
                // })
                const indexesToRemove = []

                swingListNew.forEach((swing, index) => {

                })
        } catch (err) {
                console.error(`Error in ${ arguments.callee.name } function:: `, err)
        }
}
function arrayLogic(price) {
        try {
                swingListNew.forEach((swing, index) => {
                        Object.keys(swing.fibLevel).forEach(fibKey => {

                                if ( swing[fibKey + '-Touch'] === true) {
                                        // if (swingListNew[index - 1] )
                                }
                        })
                })
        } catch (err) {
                console.error(`Error in ${ arguments.callee.name } function:: `, err)
        }
}

function Algo(price) {
        
        Object.keys(thresholdList).forEach(threshold => {
                
                findSwings(+price, +threshold)
        })

        Object.keys(thresholdList).forEach(threshold => {
                
                findFibLevel(+threshold)
        })
        
        Object.keys(thresholdList).forEach(threshold => {
                
                isTouchFibLevel(+threshold, price)
        })
        findTrend()
        arrayLogic(price)
}

data.forEach(price => {

        Algo(price)

})


// Object.keys(thresholdList).forEach(threshold => {

//         thresholdList[threshold].swings.push(thresholdList[threshold].direction === UP ? { start: low, end: high, direction: thresholdList[threshold].direction } : { start: high, end: low, direction: thresholdList[threshold].direction } )
//         thresholdList[threshold].length = thresholdList[threshold].swings.length
// })


// console.log(thresholdList['10'].swings)
// console.log(thresholdList)
// console.log(low, high)
// console.log(swingListNew.map(e => ({...e, fibLevel: {}})))
console.table(swingListNew)

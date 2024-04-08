const asciichart = require('asciichart');
let { getFibRetracement, levels } = require('fib-retracement')
const data = require('./historicaldata/21_02_2024_BANKNIFTY_ONE_MINUTE')
const liveData = require('./livedata/19Jan2024')

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

const newData = price
// const newData = liveData.priceAndTimestamps.map(e => ({ timestamp: new Date(parseInt(e.time['$numberLong'])).toLocaleTimeString(), price: +e.price.substring(0, e.price.length - 2) }))

const UP = 'UP'
const DOWN = 'DOWN'
const NEUTRAL = 'NEUTRAL'

let swingListNew = []

let startingPoint = 0

const minSwingLength = 20
let direction = NEUTRAL

console.log(`please wait, we are analysing your data with our logic of min swing length `, minSwingLength)

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
                                swingStartTime: time,
                                detailWhenLevelTouch: [],
                                swingListToRevesedCheck: [],
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
                                swingStartTime: time,
                                detailWhenLevelTouch: [],
                                swingListToRevesedCheck: [],
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
                        swingStartTime: time,
                        detailWhenLevelTouch: [],
                        swingListToRevesedCheck: [],
                })
                direction = DOWN
                low = price
                
                swingListNew.filter(e => e.direction === direction && !e.isDeleted).forEach(swing => {

                        if (swing.lastReverseFrom) {
                                swing.reversedFrom.push(swing.lastReverseFrom)
                                swing.lastReverseFrom = ''
                        }
                })
                
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
                        swingStartTime: time,
                        detailWhenLevelTouch: [],
                        swingListToRevesedCheck: [],
                })
                direction = UP
                high = price

                swingListNew.filter(e => e.direction === direction && !e.isDeleted).forEach(swing => {
                        
                        if (swing.lastReverseFrom) {
                                swing.reversedFrom.push(swing.lastReverseFrom)
                                swing.lastReverseFrom = ''
                        }
                })
        }

        // =======END=================== ADD NEW SWING =======================END========



        // =======START=================== UPDATE SWING VALUE =======================START========
        swingListNew.forEach(swing => {
                if (swing.isDeleted) return

                if (swing.direction === UP && price > swing.high) {

                        swing.high = price
                        swing.end = price
                        swing.fibLevel = getFibRetracement(swing.low, swing.high)
                        
                        delete swing['0.236-Touch']
                        delete swing['0.382-Touch']
                        delete swing['0.5-Touch']
                        delete swing['0.618-Touch']
                        delete swing['0.786-Touch']

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

                }

        })

        // =======END=================== UPDATE SWING VALUE =======================END========


        // Delete unnessery swings those are convered 100%

        swingListNew.forEach((e, index) => {

                if (e.direction === UP && price <= (e.start + 1)) e.isDeleted = true

                if (e.direction === DOWN && price >= (e.start - 1)) e.isDeleted = true
        })


}








const checkFibLabelTouch = (price, time) => {
        try {
                swingListNew.forEach((swing, index) => {



                                swing.detailWhenLevelTouch.forEach(entry => {

                                        const checkSL = swing.entryType === UP ? entry.SL < price : entry.SL > price

                                        if (!entry.notReverse && !entry.reversed && checkSL) {
                                                entry.notReverse = true
                                                entry.notReverseTime = time
                                        }
                                })


                        
                        if (swing.isDeleted) return









                        const fibList = ['1', '0.786', '0.618', '0.5', '0.382', '0.236']
                        for (let fibKey of fibList) {

                                if (swing[fibKey + '-Touch']) break     // no need check other small lavels, because they ware touched already

                                const swingLength = swing.high - swing.low
                                let swingWiseLavelZone = 0
                                swingWiseLavelZone = swingLength > 100 ? 1 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 200 ? 2 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 300 ? 3 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 400 ? 4 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 500 ? 5 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 600 ? 6 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 700 ? 7 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 800 ? 8 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 900 ? 9 : swingWiseLavelZone
                                swingWiseLavelZone = swingLength > 1000 ? 10 : swingWiseLavelZone
                                
                                const lowerLevel = swing.fibLevel[fibKey] - (1 + swingWiseLavelZone)
                                const upperLevel = swing.fibLevel[fibKey] + (1 + swingWiseLavelZone)










                                if (swing.direction === DOWN && price >= lowerLevel && !swing[fibKey + '-Touch']) {



                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== START

                                                // MARK LAST SWING WHEN TOUCH A LEVEL ============= START

                                                const currentSwing = swingListNew[swingListNew.length - 1]
                                                const previousSwingIndex = currentSwing.direction === UP && currentSwing.end === price ? swingListNew.length - 1 : -1

                                                if (previousSwingIndex > -1) {


                                                swing.entryDetail = swing.entryDetail || {}
                                                swing.entryDetail[fibKey + '-entryCount'] = (swing.entryDetail[fibKey + '-entryCount'] || 0) + 1

                                                        swing.detailWhenLevelTouch.push({
                                                                entryPrice: price,
                                                                SL: price + 10,
                                                                entryTime: time,
                                                                entryType: swing.direction,
                                                                entryLevel: fibKey,
                                                                // reversedFrom: swing.reversedFrom,
                                                                levelTouchTime: time,
                                                                direction: swing.direction,
                                                                reversed: false,
                                                                notReverse: false,
                                                                swingStart: swing.start,
                                                                swingEnd: swing.end,
                                                                previousSwingLastReversedFrom: swingListNew[previousSwingIndex].lastReverseFrom,
                                                                currentSwingLastReversedFrom: swing.lastReverseFrom,
                                                                entryCountOfFibLevel: swing.entryDetail[fibKey + '-entryCount'],
                                                        })

                                                        swingListNew[previousSwingIndex].swingListToRevesedCheck.push({
                                                                reverseChecked: false,
                                                                fibKey,
                                                                swingIndex: index,
                                                                touchLevelindex: swing.detailWhenLevelTouch.length - 1
                                                        })
                                                } else {
                                                        // Remove entry if there no swing on between, because it is not more than minswingh length
                                                        // swing.detailWhenLevelTouch.pop()
                                                }
                                                // MARK LAST SWING WHEN TOUCH A LEVEL ============= END

                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== END


                                        // CHECK IS REVERSED FROM LAST TOUCHED LEVEL ============= START

                                        if (fibKey === '0.236') {

                                                if (swing.swingListToRevesedCheck.length) {

                                                        swing.swingListToRevesedCheck.forEach(reverseCheckSwing => {

                                                                const touchLevelDetails = swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex]
                                                                if (!touchLevelDetails.notReverse && !touchLevelDetails.reversed) {

                                                                        swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex].reversed = true
                                                                        swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex].reversedTime = time
                                                                }
                                                        })

                                                        swing.swingListToRevesedCheck = []
                                                }
                                        }

                                        // CHECK IS REVERSED FROM LAST TOUCHED LEVEL ============= END





                                        swing[fibKey + '-Touch'] = true
                                        swing.lastReverseFrom = fibKey
                                        break
                                }










                                if (swing.direction === UP && price <= upperLevel && !swing[fibKey + '-Touch']) {



                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== START

                                                // MARK LAST SWING WHEN TOUCH A LEVEL =============START

                                                const currentSwing = swingListNew[swingListNew.length - 1]
                                                const previousSwingIndex = currentSwing.direction === DOWN && currentSwing.end === price ? swingListNew.length - 1 : -1

                                                if (previousSwingIndex > -1) {

                                                swing.entryDetail = swing.entryDetail || {}
                                                swing.entryDetail[fibKey + '-entryCount'] = (swing.entryDetail[fibKey + '-entryCount'] || 0) + 1

                                                swing.detailWhenLevelTouch.push({
                                                        // INDEX: swing.detailWhenLevelTouch.length,
                                                        entryPrice: price,
                                                        SL: price - 10,
                                                        entryTime: time,
                                                        entryLevel: fibKey,
                                                        entryType: swing.direction,
                                                        // reversedFrom: swing.reversedFrom,
                                                        direction: swing.direction,
                                                        levelTouchTime: time,
                                                        reversed: false,
                                                        notReverse: false,
                                                        swingStart: swing.start,
                                                        swingEnd: swing.end,
                                                        previousSwingLastReversedFrom: swingListNew[previousSwingIndex].lastReverseFrom,
                                                        currentSwingLastReversedFrom: swing.lastReverseFrom,
                                                        entryCountOfFibLevel: swing.entryDetail[fibKey + '-entryCount'],
                                                })

                                                        swingListNew[previousSwingIndex].swingListToRevesedCheck.push({
                                                                reverseChecked: false,
                                                                fibKey,
                                                                swingIndex: index,
                                                                touchLevelindex: swing.detailWhenLevelTouch.length - 1
                                                        })
                                                } else {
                                                        // Remove entry if there no swing on between, because it is not more than minswingh length
                                                        // swing.detailWhenLevelTouch.pop()
                                                }

                                                // MARK LAST SWING WHEN TOUCH A LEVEL =============END

                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== END



                                        // CHECK IS REVERSED FROM LAST TOUCHED LEVEL ============= START

                                        if (fibKey === '0.236') {
                                                if (swing.swingListToRevesedCheck.length) {

                                                        swing.swingListToRevesedCheck.forEach(reverseCheckSwing => {

                                                                const touchLevelDetails = swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex]
                                                                if (!touchLevelDetails.notReverse && !touchLevelDetails.reversed) {

                                                                        swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex].reversed = true
                                                                        swingListNew[reverseCheckSwing.swingIndex].detailWhenLevelTouch[reverseCheckSwing.touchLevelindex].reversedTime = time
                                                                }
                                                        })

                                                        swing.swingListToRevesedCheck = []
                                                }
                                        }

                                        // CHECK IS REVERSED FROM LAST TOUCHED LEVEL ============= END




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













newData.forEach(e => {
        
        findSwings(+e.price, e.timestamp)
        checkFibLabelTouch(+e.price, e.timestamp)

})










let notReveseList = []
swingListNew.forEach(e => {
        
        notReveseList = [ ...notReveseList, ...(e.detailWhenLevelTouch || []) ]
})
// console.table(notReveseList.filter(e => !e.notReverse && !e.reversed))
// console.table(notReveseList.filter(e => e.notReverse))
// console.table(notReveseList.filter(e => e.reversed))
// console.table(notReveseList.filter(e => e.reversed && !e.reEntry05))
console.table(notReveseList.map(e => ({
        fibKey: e.entryLevel,
        fibEntryCount: e.entryCountOfFibLevel,
        // levelTouchTime: e.levelTouchTime,
        direction: e.direction,
        reversed: e.reversed,
        notReverse: e.notReverse,
        swingStart: e.swingStart,
        swingEnd: e.swingEnd,
        PSLRF: e.previousSwingLastReversedFrom,
        CSLRF: e.currentSwingLastReversedFrom,

        // reversedTime: e.reversedTime,
        // reEntry05: e.reEntry05,
        // reEntry06: e.reEntry06,
        // reEntry07: e.reEntry07,
        // reEntry10: e.reEntry,
        // secEntry12: e.secEntry,
        // ...e
})).filter((e, index) => index < 20))
// console.log(swingListNew[10])


console.log(`Reversed from 0.236: `, notReveseList.filter(e => e.entryLevel === '0.236').length)
console.log(`Reversed from 0.382: `, notReveseList.filter(e => e.entryLevel === '0.382').length)
console.log(`Reversed from 0.5:   `, notReveseList.filter(e => e.entryLevel === '0.5'  ).length)
console.log(`Reversed from 0.618: `, notReveseList.filter(e => e.entryLevel === '0.618').length)
console.log(`Reversed from 0.786: `, notReveseList.filter(e => e.entryLevel === '0.786').length)
console.log(`Reversed from 1:     `, notReveseList.filter(e => e.entryLevel === '1'    ).length)
console.log(`Reversed from 1.272: `, notReveseList.filter(e => e.entryLevel === '1.272').length)


console.log(`Neutral `, notReveseList.filter(e => !e.notReverse && !e.reversed).length)
console.log(`Reversed `, notReveseList.filter(e => e.reversed).length)
console.log(`Not Reversed `, notReveseList.filter(e => e.notReverse).length)
// console.table(swingListNew.map(e => ({ start: e.start, end: e.end, high: e.high, low: e.low, direction: e.direction, swingStartTime: e.swingStartTime })))












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
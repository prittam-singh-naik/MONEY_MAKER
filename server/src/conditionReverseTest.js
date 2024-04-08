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
                        
                        if (swing.isDeleted) {

                                if (!swing['1-Touch']) {

                                        swing['1-Touch'] = true
        
                                        swing.detailWhenLevelTouch.forEach(entry => {
        
                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry) {
                                                        entry.reEntry = true
                                                        // entry.reEntryTime = time
                                                }
                                        })
                                }



                                // const lowerLevel = swing.fibLevel['1.272'] - 1
                                // const upperLevel = swing.fibLevel['1.272'] + 1

                                // if (swing.direction === DOWN && price >= lowerLevel && !swing['1.272-Touch']) {

                                //         swing['1.272-Touch'] = true
                                //         swing.detailWhenLevelTouch.forEach(entry => {
        
                                //                 if (!entry.notReverse && !entry.reversed && entry.reEntry) {
                                //                         entry.notReverse = true
                                //                         entry.notReverseTime = time
                                //                 }
                                //         })

                                // }

                                // if (swing.direction === UP && price <= upperLevel && !swing['1.272-Touch']) {

                                //         swing['1.272-Touch'] = true
                                //         swing.detailWhenLevelTouch.forEach(entry => {
        
                                //                 if (!entry.notReverse && !entry.reversed && entry.reEntry) {
                                //                         entry.notReverse = true
                                //                         entry.notReverseTime = time
                                //                 }
                                //         })

                                // }




                                const lowerLevel = swing.fibLevel['1.272'] - 1
                                const upperLevel = swing.fibLevel['1.272'] + 1

                                if (swing.direction === DOWN && price >= lowerLevel && !swing['1.272-Touch']) {

                                        swing['1.272-Touch'] = true
                                        swing.detailWhenLevelTouch.forEach(entry => {
        
                                                if (!entry.notReverse && !entry.reversed && !entry.secEntry) {
                                                        entry.secEntry = true
                                                        // entry.secEntryTime = time
                                                }
                                        })

                                }

                                if (swing.direction === UP && price <= upperLevel && !swing['1.272-Touch']) {

                                        swing['1.272-Touch'] = true
                                        swing.detailWhenLevelTouch.forEach(entry => {
        
                                                if (!entry.notReverse && !entry.reversed && !entry.secEntry) {
                                                        entry.secEntry = true
                                                        // entry.secEntryTime = time
                                                }
                                        })

                                }
                                const lowerLevel1 = swing.fibLevel['1.618'] - 1
                                const upperLevel1 = swing.fibLevel['1.618'] + 1

                                if (swing.direction === DOWN && price >= lowerLevel1 && !swing['1.618-Touch']) {

                                        swing['1.618-Touch'] = true
                                        swing.detailWhenLevelTouch.forEach(entry => {
        
                                                if (!entry.notReverse && !entry.reversed) {
                                                        entry.notReverse = true
                                                        // entry.notReverseTime = time
                                                }
                                        })

                                }

                                if (swing.direction === UP && price <= upperLevel1 && !swing['1.618-Touch']) {

                                        swing['1.618-Touch'] = true
                                        swing.detailWhenLevelTouch.forEach(entry => {
        
                                                if (!entry.notReverse && !entry.reversed) {
                                                        entry.notReverse = true
                                                        // entry.notReverseTime = time
                                                }
                                        })

                                }





                                return
                        }











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

                                        swing[fibKey + '-Touch'] = true
                                        swing.lastReverseFrom = fibKey


                                        
                                        if (fibKey === '0.5') {

                                                // if (!swing['0.5-Touch']) {
        
                                                        // swing['0.5-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry05) {
                                                                        entry.reEntry05 = true
                                                                        // entry.reEntry05Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '0.618') {

                                                // if (!swing['0.618-Touch']) {
        
                                                        // swing['0.618-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry06) {
                                                                        entry.reEntry06 = true
                                                                        // entry.reEntry06Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '0.786') {

                                                // if (!swing['0.786-Touch']) {
        
                                                        // swing['0.786-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry07) {
                                                                        entry.reEntry07 = true
                                                                        // entry.reEntry07Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '1') {

                                                // if (!swing['1-Touch']) {
        
                                                        // swing['1-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry) {
                                                                        entry.reEntry = true
                                                                        // entry.reEntryTime = time
                                                                }
                                                        })
                                                // }
                                        }









                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== START

                                        if (fibKey === '0.382') {

                                                

                                                // MARK LAST SWING WHEN TOUCH A LEVEL ============= START

                                                const currentSwing = swingListNew[swingListNew.length - 1]
                                                const previousSwingIndex = currentSwing.direction === UP && currentSwing.end === price ? swingListNew.length - 1 : -1

                                                if (previousSwingIndex > -1) {

                                                        swing.detailWhenLevelTouch.push({
                                                                fibKey,
                                                                // reversedFrom: swing.reversedFrom,
                                                                levelTouchTime: time,
                                                                direction: swing.direction,
                                                                reversed: false,
                                                                notReverse: false,
                                                                swingStart: swing.start,
                                                                swingEnd: swing.end,
                                                                previousSwingLastReversedFrom: swingListNew[previousSwingIndex].lastReverseFrom,
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


                                        }
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


                                        break
                                }










                                if (swing.direction === UP && price <= upperLevel && !swing[fibKey + '-Touch']) {

                                        swing[fibKey + '-Touch'] = true
                                        swing.lastReverseFrom = fibKey





                                        if (fibKey === '0.5') {

                                                // if (!swing['0.5-Touch']) {
        
                                                        // swing['0.5-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry05) {
                                                                        entry.reEntry05 = true
                                                                        // entry.reEntry05Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '0.618') {

                                                // if (!swing['0.618-Touch']) {
        
                                                        // swing['0.618-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry06) {
                                                                        entry.reEntry06 = true
                                                                        // entry.reEntry06Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '0.786') {

                                                // if (!swing['0.786-Touch']) {
        
                                                        // swing['0.786-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry07) {
                                                                        entry.reEntry07 = true
                                                                        // entry.reEntry07Time = time
                                                                }
                                                        })
                                                // }
                                        }

                                        if (fibKey === '1') {

                                                // if (!swing['1-Touch']) {
        
                                                        // swing['1-Touch'] = true
                        
                                                        swing.detailWhenLevelTouch.forEach(entry => {
                        
                                                                if (!entry.notReverse && !entry.reversed && !entry.reEntry) {
                                                                        entry.reEntry = true
                                                                        // entry.reEntryTime = time
                                                                }
                                                        })
                                                // }
                                        }






                                        // ADD SWING REVERSED DETAILS TO ANALYSE WHEN IT WILL REVESE AND WHEN WILL NOT =============== START

                                        if (fibKey === '0.382') {
                                                


                                                // MARK LAST SWING WHEN TOUCH A LEVEL =============START

                                                const currentSwing = swingListNew[swingListNew.length - 1]
                                                const previousSwingIndex = currentSwing.direction === DOWN && currentSwing.end === price ? swingListNew.length - 1 : -1

                                                if (previousSwingIndex > -1) {


                                                swing.detailWhenLevelTouch.push({
                                                        // INDEX: swing.detailWhenLevelTouch.length,
                                                        fibKey,
                                                        // reversedFrom: swing.reversedFrom,
                                                        direction: swing.direction,
                                                        levelTouchTime: time,
                                                        reversed: false,
                                                        notReverse: false,
                                                        swingStart: swing.start,
                                                        swingEnd: swing.end,
                                                        previousSwingLastReversedFrom: swingListNew[previousSwingIndex].lastReverseFrom,
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



                                        }
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
        // fibKey: e.fibKey,
        // levelTouchTime: e.levelTouchTime,
        // direction: e.direction,
        reversed: e.reversed,
        notReverse: e.notReverse,
        swingStart: e.swingStart,
        swingEnd: e.swingEnd,
        previousSwingLastReversedFrom: e.previousSwingLastReversedFrom,
        // reversedTime: e.reversedTime,
        reEntry05: e.reEntry05,
        reEntry06: e.reEntry06,
        reEntry07: e.reEntry07,
        reEntry10: e.reEntry,
        secEntry12: e.secEntry,
        // ...e
})))
// console.log(swingListNew[10])


console.log(`Reversed from 0.382: `, notReveseList.filter(e => e.reversed && !e.reEntry05).length)
console.log(`Reversed from 0.5:   `, notReveseList.filter(e => e.reversed && e.reEntry05 && !e.reEntry06 ).length)
console.log(`Reversed from 0.618: `, notReveseList.filter(e => e.reversed && e.reEntry06 && !e.reEntry07 ).length)
console.log(`Reversed from 0.786: `, notReveseList.filter(e => e.reversed && e.reEntry07 && !e.reEntry   ).length)
console.log(`Reversed from 1:     `, notReveseList.filter(e => e.reversed && e.reEntry   && !e.secEntry  ).length)
console.log(`Reversed from 1.272: `, notReveseList.filter(e => e.reversed && e.secEntry  ).length)


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





// // const finCorpLoan = 5695//8273
// const finCorpLoan = 8273
// const kreditBeeLoan = 13735
// const stashFinLoan = 4171    //Close from EPF
// const hdfcLoan = 32100
// const SBICreditCard = 2222
// const ICICreditCard = 3464
// // const axisCreditCard = 7348//10743
// const axisCreditCard = 10743
// const yesBankLoan = 1200
// const yesBankCreditCard = 2117
// const total11 = finCorpLoan + kreditBeeLoan + stashFinLoan + hdfcLoan + SBICreditCard + ICICreditCard + axisCreditCard + yesBankLoan + yesBankCreditCard
// console.log(total11)




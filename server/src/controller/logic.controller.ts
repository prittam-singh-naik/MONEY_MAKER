import { NEGATIVE_SIGNAL, POSITIVE_SIGNAL } from "../constants/signals.constants"
import { getNearestOptionCEOrPE, getPositions, placeOrder } from "../live-client/angelone.websocket"
import AlgoSignal from "../models/signal.model"

const orderDetails: any = {}
const lastOrderDetails: any = {}
const quantity = 45
let isTargetAchived = false

export const handleAlgoLogic = async ({ cp, symbol, diff, timeStamp, signalType }: { cp: Number, symbol: String, diff: Number, timeStamp: Date, signalType: String }) => {
        try {



                if (signalType === POSITIVE_SIGNAL) {
                        
                        if (diff == 35) {

                                if (lastOrderDetails.PE) {
                                        await placeOrder({ isEntry: false, tokenDetails: lastOrderDetails.PE, quantity })
                                        lastOrderDetails.PE = ''
                                }
                                if (isTargetAchived) return

                                const  tokenDetails = await getNearestOptionCEOrPE(cp, 'CE')
                                placeOrder({ isEntry: true, tokenDetails, quantity })
                                lastOrderDetails.CE = tokenDetails
                        }

                }
                
                if (signalType === NEGATIVE_SIGNAL) {
                        if (diff == 35) {

                                if (lastOrderDetails.CE) {
                                        await placeOrder({ isEntry: false, tokenDetails: lastOrderDetails.CE, quantity })
                                        lastOrderDetails.CE = ''
                                }
                                if (isTargetAchived) return

                                const tokenDetails = await getNearestOptionCEOrPE(cp, 'PE')

                                placeOrder({ isEntry: true, tokenDetails, quantity })
                                lastOrderDetails.PE = tokenDetails

                        }

                }



                const positiveSignal = signalType === POSITIVE_SIGNAL
                const negativeSignal = signalType === NEGATIVE_SIGNAL
                const key = symbol + '' + diff
                let orderHistory = orderDetails[key]
                if (!orderHistory) orderHistory = orderDetails[key] = { positive: false, negative: false }

                await AlgoSignal.updateOne({ symbol, diff, positive: !positiveSignal, negative: !negativeSignal, isOrderCompleted: false }, { $set: { isOrderCompleted: true, exitOn: cp, exitType: 'normal' } })
                
                orderDetails[key].positive = positiveSignal
                orderDetails[key].negative = negativeSignal
                await AlgoSignal.create({ price: cp, symbol, diff, timeStamp, positive: positiveSignal, negative: negativeSignal, entryOn: cp })

                console.log(signalType, ' signal added to DB ', (symbol + '' + diff), )
        } catch (err) {
                console.error(`Error inside handleAlgoLogic function:: `, err)
        }
}

async function checkTarget () {
        try {
                const positions = await getPositions()
                console.log(positions)

        } catch (err) {
                console.error(`Error insdie checkTarget function:: `, err)
        }
}


// setTimeout(() => {
//         setInterval(() => {
//                 console.log(`interval check target`)
//                 checkTarget()
//         }, 1000 * 10)
// }, 5000)
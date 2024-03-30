import { NEGATIVE_SIGNAL, POSITIVE_SIGNAL } from "../constants/signals.constants"
import { handleAlgoLogic } from "../controller/logic.controller"

const lastDetails: any = {}

export const algo = async ({ cp, symbol, timeStamp = new Date(), diff, authToken, feedToken }: any) => {
        try {
                const key = symbol + '' + diff
                const ld = lastDetails[key]

                if (!ld) {
                        lastDetails[key] = {
                                lp: cp,
                                positive: false,
                                negative: false,
                                cp: cp
                        }
                        console.log(`set initial value for ${key} :::: `, lastDetails[key])
                        // if (diff == 35) placeOrder({authToken, feedToken, signalType: POSITIVE_SIGNAL})

                        // setTimeout(() => {
                        //         handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: POSITIVE_SIGNAL })

                        //         setTimeout(() => {
                        //                 handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: NEGATIVE_SIGNAL })


                        //                 setTimeout(() => {
                        //                         handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: POSITIVE_SIGNAL })


                        //                         setTimeout(() => {
                        //                                 handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: NEGATIVE_SIGNAL })

                        //                         }, 2000)


                        //                 }, 2000)

                        //         }, 2000)


                        // }, 10000)
                        return
                }
                if (!ld.positive && (cp >= ld.lp + diff)) {
                        lastDetails[key].lp = cp
                        lastDetails[key].positive = true
                        lastDetails[key].negative = false

                        handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: POSITIVE_SIGNAL })
                        // if (diff == 35) {
                        //         // const  tokenDetails = await getNearestOptionCEOrPE(47840 + 250, 'CE')
                        //         placeOrder({authToken, feedToken, signalType: POSITIVE_SIGNAL})
                        // }

                }
                if (!ld.negative && (cp <= ld.lp - diff)) {
                        lastDetails[key].lp = cp
                        lastDetails[key].negative = true
                        lastDetails[key].positive = false

                        handleAlgoLogic({ cp, symbol, diff, timeStamp, signalType: NEGATIVE_SIGNAL })
                        // if (diff == 35) {
                        //         placeOrder({authToken, feedToken, signalType:  NEGATIVE_SIGNAL})
                        // }
                }

                if (ld.positive && (cp > ld.lp)) {
                        lastDetails[key].lp = cp
                }
                if (ld.negative && (cp < ld.lp)) {
                        lastDetails[key].lp = cp
                }

        } catch (error) {
                console.error(error)
        }
}






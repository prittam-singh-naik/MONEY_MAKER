import Binance, { OrderType } from 'binance-api-node'
import { BINANCE_API_KEY, BINANCE_API_SECRET } from '../constants/binance.constants'
// Authenticated client, can make signed calls
console.log(`file loaded`)
console.log(`file loaded`)
console.log(`file loaded`)
console.log(`file loaded`)

const client = Binance();


const client2 = Binance({
        apiKey: BINANCE_API_KEY,
        apiSecret: BINANCE_API_SECRET,
        // getTime: xxx,
      })

      const symbol = 'BTCUSDT';

      console.log(client2.getInfo())

      console.log(`file loaded`)
      console.log(`file loaded`)
export const placeOrder = async () => {
        try {
                client2.order({
                        type: OrderType.MARKET,
                        quantity: '0.1',
                        symbol: symbol,
                        side: 'BUY'
                })
                // await client2.order({
                //         symbol: 'XLMETH',
                //         side: 'BUY',
                //         quantity: '100',
                //         price: '0.0002',
                //       })
        } catch (err) {
                console.error(err)
        }
}


console.log(`file loaded`)
console.log(`file loaded`)


console.log(`file loaded`)
console.log(`file loaded`)
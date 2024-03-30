


import WebSocket from 'ws';
import { algo } from '../algo/algo';


export const start = () => {
        
        console.log('start logic')
        
        const wsEth = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade')
        
        let cp = 0
        wsEth.onmessage = (event: any) => {
                const stockObject = JSON.parse(event.data)
                // console.log(+stockObject.p)
                cp = +stockObject.p
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 10 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 15 })
                algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 20 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 25 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 30 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 35 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 40 })
                // algo({ cp: +stockObject.p, symbol: stockObject.s, diff: 45 })
        }
}
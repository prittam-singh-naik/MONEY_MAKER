import express, { NextFunction, Request, Response } from "express"
import path from "path"
import { connect } from 'mongoose'

import dotenv from "dotenv"
dotenv.config()

import * as otplib from 'otplib';

const secret = 'GF6ETGCIS77XAZGMFH5EXHOD4A'


// import { start } from './live-client/binance.websocket'
const app = express()
app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(req.method, req.url)
        next()
})


const token = otplib.authenticator.generate(secret);

console.log('Generated TOTP:', token);
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const details of interfaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'UNKNOWN';
}

async function getPublicIP() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip || 'UNKNOWN';
  } catch (error: any) {
    console.error('Error getting public IP:', error.message);
    return 'UNKNOWN';
  }
}

function getMACAddress() {
  const networkInterfaces = os.networkInterfaces();
  const macAddress = networkInterfaces['Ethernet 0']?.[0]?.mac || 'UNKNOWN';
  return macAddress;
}
var axios = require('axios');






async function main() {
        try {
                const clientLocalIP = getLocalIP();
  const clientPublicIP = await getPublicIP();
  const macAddress = getMACAddress();
                var data = JSON.stringify({
                        "clientcode":"P399999",
                        "password":2486,
                            "totp": token
                    });
                    
                    const config: any = {
                      method: 'post',
                      url: 'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword',
                    
                      headers : {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-UserType': 'USER',
                        'X-SourceID': 'WEB',
                        'X-ClientLocalIP': clientLocalIP,
                        'X-ClientPublicIP': clientPublicIP,
                        'X-MACAddress': macAddress,
                        'X-PrivateKey': 'MHF0gUta'
                      },
                      data : data
                    }
                    console.log(config)
                    
                    axios(config)
                    .then(function (response: any) {
                            console.log(`Response::::`)
                      console.log(JSON.stringify(response.data))
                    })
                    .catch(function (error: any) {
                            console.log(`Error::`)
                      console.log(error.message)
                    })
        } catch (err) {
                console.log(err)
        }
}
// main()












setInterval(() => {
        const token = otplib.authenticator.generate(secret);
        
        console.log('Generated TOTP in 30 Sec:', token);

}, 30000)



app.use(express.static(path.join(__dirname, "public")))

import { updateToken } from './controller/angelone.controller'
// import { LOGIN_URL } from "./constants/angelone.constant"
// import RestartLog from "./models/restart.model"
// import AlgoSignal from "./models/signal.model"


// import { schedule } from 'node-cron'
// import { ANGEL_PLATFORM_NAME, API_KEY, CLIENT_CODE } from './constants/angelone.constant'
// import AuthTokenModel from './models/token.model'
// import { NEGATIVE_SIGNAL, POSITIVE_SIGNAL } from "./constants/signals.constants"
// const { SmartAPI } = require('smartapi-javascript')

// import { placeOrder } from './service/binance.service'


// setTimeout(() => {
//         placeOrder()
//         console.log(`timeout called`)
// }, 10000)
// app.get('/', (req: Request, res: Response) => {
//         const response = `<h1 style='text-align: center'>Will redirect to login page in few seconds</h1>
//                 <script>window.location.replace("${LOGIN_URL}");
//                 </script>`
//         res.send(response)
// })

// app.get('/api/afterLogin', (req: Request, res: Response) => {

//         updateToken(req.query)
//         const response = `<h1 style='text-align: center'>Successfully logged in, redirecting in few seconds</h1>
//                 <script>window.location.replace("http://localhost:4200/");
//                 </script>`
//         res.send(response)
// })
app.get('/oauth/callback', async (req: Request, res: Response) => {

        await updateToken(req.query)
        res.redirect('http://localhost:4200')
})


const port = 9999

connect('mongodb+srv://Pritam:rockkky1234@cluster0.3vpfnhn.mongodb.net/mm').then( async res => {
        console.log('mongodb connected successsfully ', process.env.ENVIRNMENT)
//         if (process.env.ENVIRNMENT === 'LIVE') {
//                 changeAngelOneToken()
//                 await RestartLog.create({ 
//                         restartOn: new Date(),
//                         restartDate: new Date().toLocaleDateString(),
//                         restartTime: new Date().toLocaleTimeString(),
//                         envirnment: process.env.ENVIRNMENT
//                  })
//                 await AlgoSignal.updateMany({ isOrderCompleted: false }, { $set: { isOrderCompleted: true, exitType: 'restart' } })
//                 start()
//         }
//         checkReport()

        app.listen(port, () => {
                console.log(`Server running on port ${port}`)
        });
})




// // schedule('30 8 * * 1-5', () => {
// //         console.log('Task executed at 8:30 AM from Monday to Friday')
// //         changeAngelOneToken()
// // })

// // schedule('* * * * *', () => {
// //         console.log('Task executed every minute')
// //         changeAngelOneToken()
// // })

// schedule('0 */2 * * *', () => {
//         console.log('Task executed every 2 hours')
//         changeAngelOneToken()
// })

// const changeAngelOneToken = async () => {
//         try {
//                 // const tokenDetails = await AuthTokenModel.findOne({ platform: ANGEL_PLATFORM_NAME }).lean()

//                 // const refreshToken = tokenDetails?.refreshToken
//                 // const accessToken = tokenDetails?.authToken
//                 // let smart_api = new SmartAPI({
//                 //         api_key: API_KEY,
//                 //         access_token: accessToken,
//                 //         client_code: CLIENT_CODE,
//                 //         refresh_token: refreshToken
//                 // })
//                 // const data = await smart_api.generateToken(refreshToken)
//                 // console.log(`success :: Token generated:::: `)
//                 // console.log(data)
//                 // if (data?.data?.jwtToken) {
//                 //         updateToken({ auth_token: data?.data?.jwtToken, feed_token: data?.data?.feedToken, refresh_token: data?.data?.refreshToken })
//                 // } else {
//                 //         console.log(`invalid token details:::`, data)
//                 // }

//         } catch (err) {
//                 console.log('error while generating token daily....')
//                 console.log(err)
//         }
// }



// const checkReport = async () => {
//         try {

//                 const aggregateQuery: any[] = [
//                         {
//                                 $match: { exitType: 'normal', isOrderCompleted: true, symbol: 'BTCUSDT', diff: 20 }
//                         },
//                         {
//                                 $project: {
//                                         _id: 0, //entryOn: 1, exitOn: 1,
//                                         signalType: { $cond: [
//                                                 { $eq: [ "$positive", true ] },
//                                                 POSITIVE_SIGNAL, NEGATIVE_SIGNAL
//                                         ] },
//                                         diff: 1,
//                                         pnl: { $cond: [
//                                                 { $eq: [ "$positive", true ] },
//                                                 { $subtract: ['$exitOn', '$entryOn']  },
//                                                 { $subtract: ['$entryOn', '$exitOn']  }
//                                         ] },
//                                         timeStamp: 1
//                                 }
//                         }
//                 ]
//                 const result = await AlgoSignal.aggregate(aggregateQuery)
//                 console.table(result)
//                 console.log(`Total plus :::: `, result.filter(e => e.pnl > 0).reduce((acc, cur) => acc + cur.pnl, 0))
//                 console.log(`Total minus :::: `, result.filter(e => e.pnl <= 0).reduce((acc, cur) => acc + cur.pnl, 0))
//                 console.log(`Total:::: `, result.reduce((acc, cur) => acc + cur.pnl, 0))
//                 console.log(`profit orders::: `, result.filter(e => e.pnl > 0).length)
//                 console.log(`loss orders::: `, result.filter(e => e.pnl <= 0).length)
//         } catch(err) {
//                 console.error(err)
//         }
// }


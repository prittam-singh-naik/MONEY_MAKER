import 'dotenv/config'
import express, { NextFunction, Request, Response } from "express"
import path from "path"
import { connect } from 'mongoose'
import { schedule } from 'node-cron'

import dotenv from "dotenv"
dotenv.config()

import { updateToken } from './controller/angelone.controller'

import * as otplib from 'otplib';
import { API_KEY, CLIENT_CODE, PASS_CODE } from "./constants/angelone.constant"

const secret = 'GF6ETGCIS77XAZGMFH5EXHOD4A'

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
const axios = require('axios')


async function main() {
        try {
                const clientLocalIP = getLocalIP();
                const clientPublicIP = await getPublicIP();
                const macAddress = getMACAddress();
                var data = JSON.stringify({
                        "clientcode": CLIENT_CODE,
                        "password": PASS_CODE,
                        "totp": token
                });

                const config: any = {
                        method: 'post',
                        url: 'https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword',

                        headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-UserType': 'USER',
                                'X-SourceID': 'WEB',
                                'X-ClientLocalIP': clientLocalIP,
                                'X-ClientPublicIP': clientPublicIP,
                                'X-MACAddress': macAddress,
                                'X-PrivateKey': API_KEY
                        },
                        data: data
                }
                console.log(`LOGIN API DETAILS:: `, config)

                const response = await axios(config)
                console.log(`LOGIN RESPONSE: `, response.data)
                const tokenDetails = response.data.data
                updateToken(tokenDetails)
        } catch (err) {
                console.log(err)
        }
}


app.use(express.static(path.join(__dirname, "public")))

import RestartLog from "./models/restart.model"
import AlgoSignal from "./models/signal.model"
import { NEGATIVE_SIGNAL, POSITIVE_SIGNAL } from "./constants/signals.constants"
// import { NEGATIVE_SIGNAL, POSITIVE_SIGNAL } from "./constants/signals.constants"


app.get('/oauth/callback', async (req: Request, res: Response) => {

        await updateToken(req.query)
        res.redirect('http://localhost:4200')
})


const port = process.env.PORT || 9999
// const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://Pritam:rockkky1234@cluster0.3vpfnhn.mongodb.net/mm'
// const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://local_user:NS5J4wpt3888sbQx@cluster0.3vpfnhn.mongodb.net/?retryWrites=true&w=majority'
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://banda:REb1EJ3sjb4iFOcV@cluster0.3vpfnhn.mongodb.net/?retryWrites=true&w=majority'

// connect(MONGODB_URL).then(async res => {
//         console.log('mongodb connected successsfully ', process.env.ENVIRNMENT)
//                 // // if (process.env.ENVIRNMENT === 'LIVE') {
//                         // await RestartLog.create({ 
//                         //         restartOn: new Date(),
//                         //         restartDate: new Date().toLocaleDateString(),
//                         //         restartTime: new Date().toLocaleTimeString(),
//                         //         envirnment: process.env.ENVIRNMENT
//                         //  })
//                         // await AlgoSignal.updateMany({ isOrderCompleted: false }, { $set: { isOrderCompleted: true, exitType: 'restart' } })

//                         // main()
//                 // // }
//                 checkReport()
//         })
        
                app.listen(port, () => {
                        console.log(`Server running on port ${port}`)
                });




schedule('30 2 * * 1-5', () => {
        console.log('Task executed at 8:00 AM from Monday to Friday, Which is set in UTC time at 2.30 AM')
        // main()
})




app.get('/tokenList', async (req: Request, res: Response) => {
        try {
                const response = await axios(`https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json`)
                const tokenList = response.data
                const indexTokens = tokenList.filter((e: any) => e.instrumenttype === 'AMXIDX' && (e.name === 'NIFTY' || e.name === 'BANKNIFTY'))
                // const indexTokens = tokenList.filter((e: any) => (e.instrumenttype === 'FUTIDX' || e.instrumenttype == 'OPTIDX') && (e.name === 'NIFTY' || e.name === 'BANKNIFTY'))
                res.send(indexTokens)

        } catch (err) {
                console.error(err)
        }
})

const data = require('./livedata/19Jan2024')
app.get('/data', async (req: Request, res: Response) => {
        try {
                
                const price = data.priceAndTimestamps.sort((a: any, b: any) => a.time.$numberLong - b.time.$numberLong).map((e: any) => ({ price: e.price.substring(0, e.price.length - 2), time: new Date(parseInt(e.time.$numberLong)).toLocaleString() }))
                
                const chartData = price.map((e: any) => +e.price)//.filter((e: any, index: number) => index < 1110)
                
                res.send([chartData])

        } catch (err) {
                console.error(err)
        }
})


const checkReport = async () => {
        try {

                const aggregateQuery: any[] = [
                        {
                                $match: { 
                                        // symbol: '"61627"', 
                                        timeStamp: { $gte: new Date('2024-01-19T03:45:20.946+00:00') },
                                        // exitType: 'normal', 
                                        // isOrderCompleted: true, 
                                        // symbol: 'BTCUSDT', 
                                        // diff: 35
                                 }
                        },
                        {
                                $project: {
                                        _id: 0,
                                        entryOn: 1,
                                        // exitOn: 1,
                                        signalType: { $cond: [
                                                { $eq: [ "$positive", true ] },
                                                POSITIVE_SIGNAL, NEGATIVE_SIGNAL
                                        ] },
                                        diff: 1,
                                        // pnl: { $cond: [
                                        //         { $eq: [ "$positive", true ] },
                                        //         { $subtract: ['$exitOn', '$entryOn']  },
                                        //         { $subtract: ['$entryOn', '$exitOn']  }
                                        // ] },
                                        timeStamp: 1
                                }
                        },
                        {
                                $sort: { _id: 1 }
                        }
                ]
                const result = await AlgoSignal.aggregate(aggregateQuery)
                result.forEach((e, index) => {
                        if(!result[index + 1]) return e.pnl = 0
                        e.pnl = e.signalType === POSITIVE_SIGNAL ? result[index + 1].entryOn - e.entryOn : e.entryOn - result[index + 1].entryOn
                })
                console.table(result)
                console.log(`Total plus :::: `, result.filter(e => e.pnl > 0).reduce((acc, cur) => acc + cur.pnl, 0))
                console.log(`Total minus :::: `, result.filter(e => e.pnl <= 0).reduce((acc, cur) => acc + cur.pnl, 0))
                console.log(`Total:::: `, result.reduce((acc, cur) => acc + cur.pnl, 0))
                console.log(`profit orders::: `, result.filter(e => e.pnl > 0).length)
                console.log(`loss orders::: `, result.filter(e => e.pnl <= 0).length)
        } catch(err) {
                console.error(err)
        }
}



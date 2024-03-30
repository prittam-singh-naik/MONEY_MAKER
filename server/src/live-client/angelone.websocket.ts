const { WebSocketV2 } = require('smartapi-javascript')

import { API_KEY, CLIENT_CODE } from "../constants/angelone.constant";
import { algo } from '../algo/algo';
import PriceModel from "../models/price.model";

let web_socket: any = null
let authenticationToken: any

export const updateAuthToken = (authToken: any) => {
        authenticationToken = authToken
}

export const start = ({authToken, feedToken, tokens}: { authToken: String, feedToken: String, tokens: String[] }) => {
        try {
                console.log(`started>>>>>>>>>>>>>>>>>`)
                web_socket = null;
                web_socket = new WebSocketV2({
                        jwttoken: authToken,
                        apikey: API_KEY,
                        clientcode: CLIENT_CODE,
                        feedtype: feedToken,
                })
                authenticationToken = authToken

                web_socket.connect().then((res: any) => {
                        let json_req = {
                                action: 1,
                                mode: 1,
                                exchangeType: 2,
                                tokens: tokens,
                        };
                
                        web_socket.fetchData(json_req);
                        web_socket.on('tick', receiveTick);
                
                        function receiveTick(data: any) {
                                console.log('receiveTick:::::', data.token, data.last_traded_price);
                                if (data?.last_traded_price) {

                                        const price = +data.last_traded_price.substring(0, data.last_traded_price.length - 2)
                                        const token = data.token
                                        // algo({ cp: price, symbol: token, diff: 10, authToken, feedToken })
                                        // algo({ cp: price, symbol: token, diff: 15, authToken, feedToken })
                                        
                                        
                                        const currentTime = Date.parse(new Date().toString())
                                        const marketTime = Date.parse(new Date(new Date(new Date(new Date().setHours(3)).setMinutes(45)).setSeconds(17)).toString())
                                        if(currentTime > marketTime) {

                                                algo({ cp: price, symbol: token, diff: 35, authToken, feedToken })
                                                
                                                algo({ cp: price, symbol: token, diff: 20, authToken, feedToken })
                                                algo({ cp: price, symbol: token, diff: 25, authToken, feedToken })
                                                algo({ cp: price, symbol: token, diff: 30, authToken, feedToken })
                                                algo({ cp: price, symbol: token, diff: 40, authToken, feedToken })
                                                algo({ cp: price, symbol: token, diff: 45, authToken, feedToken })
                                                algo({ cp: price, symbol: token, diff: 50, authToken, feedToken })

                                                PriceModel.create({ data })
                                        }
                                }
                        }
                })




        } catch (e) {
                console.error(e)
        }
}

const axios = require('axios')
const os = require('os')

let optionTokensList: any = []
let futureTokensList: any = []
export const getLatestToken = () => {
        return new Promise(async (resolve, reject) => {
                try {
                        console.log('caledddd')
                        const response = await axios(`https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json`)
                        const tokenList = response.data
                        const tokens = tokenList.filter((e: any) => e.instrumenttype === 'FUTIDX' && e.name === 'BANKNIFTY')
                        optionTokensList = [ ...tokenList.filter((e: any) => e.instrumenttype === 'OPTIDX' && e.name === 'BANKNIFTY') ]
                        futureTokensList = [ ...tokens ]

                        const monthList = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

                        let latestToken: any = ''
                        tokens.forEach((e: any) => {
                                if (!latestToken) {
                                        latestToken = e
                                        return
                                }
                                const curTokenYear = e.expiry.substring(5, 9)
                                const latestTokenYear = latestToken.expiry.substring(5, 9)

                                if (curTokenYear > latestTokenYear) {
                                        return
                                }
                        
                                const curTokenMonth = e.expiry.substring(2, 5)
                                const latestTokenMonth = latestToken.expiry.substring(2, 5)
                        
                                const curTokenMonthIndex = monthList.findIndex(e => e === curTokenMonth)
                                const latestTokenMonthIndex = monthList.findIndex(e => e === latestTokenMonth)

                                if ( latestTokenMonthIndex > curTokenMonthIndex) {
                                        latestToken = e
                                        return
                                }
                        })
                        
                        console.log(`latestToken=====`, latestToken)

                        resolve(latestToken)
        
                } catch (err) {
                        console.error(err)
                }
        })
}


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

export const placeOrder = async ({isEntry, tokenDetails, quantity = 45 }: any) => {

        
        // const data = JSON.stringify({
        //         "exchange": "NFO",
        //         "tradingsymbol": tokenDetails.symbol,
        //         "symboltoken": tokenDetails.token,
        //         quantity,
        //         "disclosedquantity": 45,
        //         "transactiontype": isEntry ? "BUY" : "SELL",
        //         "ordertype": "MARKET",
        //         "variety": "NORMAL",
        //         "producttype": "INTRADAY",
        //         "duration": "DAY",
        // })
        // const clientLocalIP = getLocalIP()
        // const clientPublicIP = await getPublicIP()
        // const macAddress = getMACAddress()

        // var config: any = {
        //         method: 'post',
        //         url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder',
        //         headers: {
        //                 'Authorization': `Bearer ${authenticationToken}`,
        //                 'Content-Type': 'application/json',
        //                 'Accept': 'application/json',
        //                 'X-UserType': 'USER',
        //                 'X-SourceID': 'WEB',
        //                 'X-ClientLocalIP': clientLocalIP,
        //                 'X-ClientPublicIP': clientPublicIP,
        //                 'X-MACAddress': macAddress,
        //                 'X-PrivateKey': API_KEY
        //         },
        //         data: data
        // };
        // console.log(config)
        // axios(config)
        //         .then(function (response: any) {
        //                 console.log(JSON.stringify(response.data));
        //         })
        //         .catch(function (error: any) {
        //                 console.log(error);
        //         });
}

export const getPositions = () => {
        return new Promise( async (resolve, reject) => {

                if (!authenticationToken) return resolve({})

                const data = ''
        
                const clientLocalIP = getLocalIP()
                const clientPublicIP = await getPublicIP()
                const macAddress = getMACAddress()
        
                const config: any = {
                        method: 'get',
                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition',
        
                        headers: {
                                'Authorization': `Bearer ${authenticationToken}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-UserType': 'USER',
                                'X-SourceID': 'WEB',
                                'X-ClientLocalIP': clientLocalIP,
                                'X-ClientPublicIP': clientPublicIP,
                                'X-MACAddress': macAddress,
                                'X-PrivateKey': API_KEY
                        },
                        data
                }
        
                axios(config)
                        .then(function (response: any) {
                                resolve(response.data)
                                console.log(JSON.stringify(response.data))
                        })
                        .catch(function (error: any) {
                                console.log(error)
                                reject()
                        })
        })
}

console.log(`calling>>>>>>>>>>>`)

export const getNearestOptionCEOrPE = (currentFuturePrice: any, type: string) => {
        return new Promise( async (resolve, reject) => {
                try {
                        if (optionTokensList.length === 0) await getLatestToken()
                        const spotPrice = +currentFuturePrice - 250
                        console.log(`spotPrice:: `, spotPrice)
                        
                        let date = new Date()
                        let currentExpiry = ''
                        for(let i = 0; i < 30; i++) {
                                
                                const currentDate = new Date(date)
                                const expiry = `${ ( '0' + currentDate.getDate() ).slice(-2) }${ currentDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() }${ currentDate.getFullYear() }`

                                if (optionTokensList.some((e: any) => e.expiry === expiry) ) {
                                        currentExpiry = expiry
                                        break
                                }
                                
                                date = new Date(date.setDate(currentDate.getDate() + 1))
                        }
                        const roundPrice = Math.round(spotPrice / 100) * 100
                        
                        console.log(`currentExpiry:: `, currentExpiry)
                        console.log(`roundPrice:: `, roundPrice)

                        const curentOption = optionTokensList.find((e: any) => {
                                

                                const expirySymbolFormat = currentExpiry.substring(0, currentExpiry.length - 4) + currentExpiry.substring(currentExpiry.length - 2, currentExpiry.length)
                                const symbol = `BANKNIFTY` + expirySymbolFormat + roundPrice + type.toLocaleUpperCase()

                                return symbol === e.symbol
                        })
                        
                        console.log(curentOption)
                        
                        resolve(curentOption)
                } catch (err) {
                        console.error(err)
                        reject()
                }
        })
}
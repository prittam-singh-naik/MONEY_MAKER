





const os = require('os');
const otplib = require('otplib');
const secret = 'GF6ETGCIS77XAZGMFH5EXHOD4A'

const TOTP = otplib.authenticator.generate(secret);

console.log('Generated TOTP:', TOTP);

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
        } catch (error) {
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

const CLIENT_CODE = 'P399999'
const API_KEY = 'MHF0gUta'
const PASS_CODE = 2486
var fs = require('fs');


const bnf = { "token": "99926009", "symbol": "Nifty Bank", "name": "BANKNIFTY", "expiry": "", "strike": "0.000000", "lotsize": "1", "instrumenttype": "AMXIDX", "exch_seg": "NSE", "tick_size": "0.000000" }
const nifty = { "token": "99926000", "symbol": "Nifty 50", "name": "NIFTY", "expiry": "", "strike": "0.000000", "lotsize": "1", "instrumenttype": "AMXIDX", "exch_seg": "NSE", "tick_size": "0.000000" }
const indicesList = [
        bnf, 
        nifty
]

let startDay = 1
const endDay = 31
const month = '01'
const year = '2024'


let clientLocalIP
let clientPublicIP
let macAddress

const loadIPDetails = () => {
        return new Promise(async (resolve, reject) => {
                clientLocalIP = getLocalIP();
                clientPublicIP = await getPublicIP();
                macAddress = getMACAddress();
                resolve()
        })
}

loadIPDetails().then(async () => {

        for (let i = 0; i < indicesList.length; i++) {
                const indices = indicesList[i]

                // ++++============SINGLE MONTH WISE+++++===============

                //         while (startDay <= endDay) {
                //                 console.log(startDay)
                //                 await downloadData(indices, String(startDay).padStart(2, '0'))

                //                 await wait()

                //                 startDay++
                //         }


                // ++++============SINGLE MONTH WISE+++++===============




                for (let year = 2015; year <= 2023; year++) {
                        for (let month = 0; month < 12; month++) {
                                for (let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {

                                        console.log(`${indices.name},  ${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);

                                        if (!fs.existsSync(`./historicaldata_backup/${String(day).padStart(2, '0')}_${String(month + 1).padStart(2, '0')}_${year}_${indices.name}_ONE_MINUTE.js`)) {
                                                await downloadData(indices, String(day).padStart(2, '0'), String(month + 1).padStart(2, '0'), year)
        
                                                await wait()
                                        }
                                }
                        }
                }
        }
})


function wait() {
        return new Promise(async (resolve, reject) => {
                setTimeout(() => {
                        resolve()
                }, 2000)
        })
}

async function downloadData(symbol, date, month, year) {
        
        return new Promise(async (resolve, reject) => {

                try {
        
                        let jwtToken = `eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IlAzOTk5OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpRTXprNU9UazVJaXdpWlhod0lqb3hOekE0T0RNek9EQTRMQ0pwWVhRaU9qRTNNRGczTkRVMU1Ua3NJbXAwYVNJNkltVmxPV0V3TWpKa0xXSTNNbVF0TkRnMk1TMDVNREZpTFRBNFpqTXpOR1kxWVRZNU9DSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qUXNJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk5Dd2ljMjkxY21ObElqb2lNeUlzSW1SbGRtbGpaVjlwWkNJNklqSmxZakkxTVRFeUxUTmhNR0V0TTJNNVpTMWlNalkyTFRVMk9XTm1ZelpqTm1Ka055SXNJbUZqZENJNmUzMTkuTWdvU0ViZTF5YWlzV1RKYk1zeGJsM0xrQThXT2Q5elYxaDFhTFY2WWNTVEg1dFNfa1JrVFJGeDRqd2xaeFlWYWF0Z0FyTDAzYXRZMF9SODVNMFFZdWciLCJBUEktS0VZIjoiTUhGMGdVdGEiLCJpYXQiOjE3MDg3NDU1NzksImV4cCI6MTcwODgzMzgwOH0.sxp6yhARZ_iMWJuxQKcg9GNBIps_zm_lYxQ-aPqHm_6toeLmqoYVHNJx7fG6mzixcd7K_x9AnHqCrCCxdC_L-Q`
        
                        if (!jwtToken) {
        
                                var data = JSON.stringify({
                                        "clientcode": CLIENT_CODE,
                                        "password": PASS_CODE,
                                        "totp": TOTP
                                });
                
                
                                const config = {
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
                                
                                if (!response.data.status) return
                
                                const tokenDetails = response.data.data
                                jwtToken = tokenDetails.jwtToken
        
                        }
        
                const dataNew = JSON.stringify({
                                "exchange": "NSE", 
                                "symboltoken": symbol.token,
                                "interval": "ONE_MINUTE",
                                "fromdate": `${year}-${ month }-${ date } 00:00`,
                                "todate": `${year}-${month}-${ date} 23:59`
                        })
                        
                        // console.log(dataNew)
        
                var config = {
                        method: 'post',
                        url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData',
                        headers: {
                                'Authorization': `Bearer ${jwtToken}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-UserType': 'USER',
                                'X-SourceID': 'WEB',
                                'X-ClientLocalIP': clientLocalIP,
                                'X-ClientPublicIP': clientPublicIP,
                                'X-MACAddress': macAddress,
                                'X-PrivateKey': API_KEY
                        },
                        data: dataNew
                }

                axios(config)
                        .then(function (response) {
                                const candleData = response.data.data
                                console.log(date, candleData?.length)
        

                                var file = fs.createWriteStream(`./historicaldata_backup/${date}_${month}_${year}_${symbol.name}_ONE_MINUTE.js`);
                                file.on('error', function (err) { console.log(`errorororororrr`, err) });
                                const dataToSave = candleData || []
                                file.write(`module.exports = ` + JSON.stringify(dataToSave)); 
                                file.end();
                                
                                


                resolve()
        })
        .catch(function (error) {
                                resolve()
                                console.log(error)
                        })
        
        
        
        
        
                } catch (err) {
                        console.log(err)
                }
        })
}

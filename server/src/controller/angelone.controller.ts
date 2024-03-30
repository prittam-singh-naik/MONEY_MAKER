import { ANGEL_PLATFORM_NAME } from "../constants/angelone.constant"
import { getLatestToken, start, updateAuthToken } from "../live-client/angelone.websocket"
import AuthTokenModel from "../models/token.model"

export const updateToken = (tokenDetails: any) => {
        return new Promise( async (resolve, reject) => {
                try {
                        const authToken = tokenDetails.jwtToken
                        const feedToken = tokenDetails.feedToken
                        const refreshToken = tokenDetails.refreshToken
        
                        updateAuthToken(authToken)
                        
                        console.log(`fetching lastest token *** `)
                        const latestTokenDetails: any = await getLatestToken()
                        // start({ authToken, feedToken, tokens: ['61627'] })
                        start({ authToken, feedToken, tokens: [latestTokenDetails.token] })
        
        
                        const dataToUpdate = { platform: ANGEL_PLATFORM_NAME, authToken, feedToken, refreshToken }
                        await AuthTokenModel.updateOne({ platform: ANGEL_PLATFORM_NAME }, { $set: dataToUpdate }, { upsert: true })
                        resolve({})
                } catch (err) {
                        console.error(err)
                        reject()
                }
        })
}


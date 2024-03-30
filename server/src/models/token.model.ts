import { Schema, model } from 'mongoose';
import { AUTH_TOKEN_COL } from '../constants/mongodb.constants'

const schema = new Schema({
        platform: { type: String, required: true },
        authToken: { type: String, required: true },
        feedToken: { type: String, required: true },
        refreshToken: { type: String, required: true }
});

const AuthTokenModel = model(AUTH_TOKEN_COL, schema);

export default AuthTokenModel
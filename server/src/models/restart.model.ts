import { Schema, model } from 'mongoose';
import { RESTART_LOG } from '../constants/mongodb.constants'

const schema = new Schema({
        restartOn: { type: Date, required: true },
        restartDate: { type: String, required: true },
        restartTime: { type: String, required: true },
        envirnment: String
});

const RestartLog = model(RESTART_LOG, schema);

export default RestartLog
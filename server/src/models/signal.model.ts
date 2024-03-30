import { Schema, model } from 'mongoose';
import { ALGO_SIGNAL_COL } from '../constants/mongodb.constants'

const schema = new Schema({
        positive: { type: Boolean, required: true },
        negative: { type: Boolean, required: true },
        price: { type: Number, required: true },
        symbol: { type: String, required: true },
        diff: { type: Number, required: true },
        timeStamp: Date,
        entryOn: { type: Number, required: true },
        exitOn: { type: Number, optional: true },
        isOrderCompleted: { type: Boolean, default: false },
        exitType: String
});

const AlgoSignal = model(ALGO_SIGNAL_COL, schema);

export default AlgoSignal
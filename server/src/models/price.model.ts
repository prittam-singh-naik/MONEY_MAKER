import { Schema, model } from 'mongoose';
import { PRICE } from '../constants/mongodb.constants'

const schema = new Schema({
        data: {}
});

const PriceModel = model(PRICE, schema);

export default PriceModel
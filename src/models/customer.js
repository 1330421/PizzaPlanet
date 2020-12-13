import mongoose from 'mongoose';
import { COORD, PLANET_NAMES } from '../utils/constants.js';

const customerSchema = mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    planet: { type: String, enum: PLANET_NAMES, required: true },
    coord: {
        lat: { type: Number, required: true, min: COORD.MIN, max: COORD.MAX },
        lon: { type: Number, required: true, min: COORD.MIN, max: COORD.MAX }
    },
    phone: { type: String, required: true }, // TODO string ou number
    birthday: { type: Date, required: true },
    referalCode: String
}, {
    collection: 'customers',
});

customerSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'customer',
    justOne: false
});

export default mongoose.model('Customer', customerSchema)
import mongoose from 'mongoose';
import { PIZZA_SIZES, PIZZA_TOPPINGS } from '../utils/constants.js';

const orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        localField:'customer',
        foreignField: '_id',
        justOne: true,
        required: true
    },
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizzeria',
        required: true,
    },
    orderDate: { type: Date, required: true },
    pizzas: [{
        size: { type: String, enum: PIZZA_SIZES, required: true },
        price: { type: Number, required: true },
        toppings: [{ type: String, enum: PIZZA_TOPPINGS }],
    }]
}, {
    collection: 'orders',
    id: false
});

export default mongoose.model('Order', orderSchema);
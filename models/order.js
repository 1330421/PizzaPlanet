import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizzeria',
        required: true
    },
    orderDate: { type: Date, required: true },
    pizzas: [{
        size: { type: String, ref: 'PIZZA_SIZES', required: true },
        price: { type: Number, required: true },
        topping: [{ type: String, ref: 'PIZZA_TOPPINGS' }],
    }]
}, {
    collection: 'orders'
});

export default mongoose.model('Order', orderSchema);
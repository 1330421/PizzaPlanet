// Fichier : ordersService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-13
// But : Fichier de service pour la gestion des commandes dans la base de données

import Order from '../models/order.js';

const TAXE = 0.0087;
const FRACTION_DIGITS = 3;

class OrdersService {

    retrieveByCriteria(criteria, options) {
        const retrieveOrder = Order.find(criteria);

        return retrieveOrder;
    }

    //--------------------
    // KS - Retrouve toutes les commandes avec les options définies
    //--------------------
    retrieveAll(options) {
        let retrieveQuery = Order.find();
        let countQuery = Order.countDocuments();

        if (options.topping) {
            const criteria = { 'pizzas.toppings': options.topping };
            retrieveQuery = Order.find(criteria);
            countQuery = Order.countDocuments(criteria);
        }

        retrieveQuery
            .limit(options.limit)
            .skip(options.skip)
            .sort('-orderDate');

        return Promise.all([retrieveQuery, countQuery]);
    }

    //--------------------
    // KS - Transforme les données de la commande pour le corps de la réponse
    //--------------------
    transform(order, options = {}) {
        order.href = `${process.env.BASE_URL}/orders/${order.customer}`;
        order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer}` };
        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria}` };
        order.subTotal = parseFloat(this.calculateSubTotal(order.pizzas).toFixed(FRACTION_DIGITS), 10);
        order.taxeRates = TAXE;
        order.taxes = parseFloat((order.subTotal * order.taxeRates).toFixed(FRACTION_DIGITS), 10);
        order.total = order.subTotal + order.taxes;

        order.pizzas.forEach(p => delete p.id);
        delete order._id;
        delete order.__v;
        return order;
    }

    //--------------------
    // KS - Calcule le sous-total de la commande
    //--------------------
    calculateSubTotal(pizzas) {
        let subTotal = 0;
        pizzas.forEach(p => {
            subTotal += p.price;
        });
        return subTotal;
    }
}

export default new OrdersService();
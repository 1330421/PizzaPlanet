// Fichier : ordersService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-13
// But : Fichier de service pour la gestion des commandes dans la base de données

import Order from '../models/order.js';

const TAXE = 0.87;
const FRACTION_DIGITS = 3;

class OrdersService {

    //--------------------
    // KS - Transforme les données de la commande pour le corps de la réponse
    //--------------------
    transform(order, options) {
        order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer}` };
        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria}` };
        order.subTotal = parseFloat(this.calculateSubTotal(order.pizzas).toFixed(FRACTION_DIGITS), 10);
        order.taxeRates = TAXE / 100; // TODO Constante
        order.taxes = parseFloat((order.subTotal * order.taxeRates).toFixed(FRACTION_DIGITS), 10);
        order.total = order.subTotal + order.taxes;

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
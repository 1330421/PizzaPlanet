// Fichier : customersService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de service pour la gestion des clients dans la base de données

import dayjs from 'dayjs';

import Customer from '../models/customer.js';
import ordersService from './ordersService.js';

class CustomersServices {

    //--------------------
    // JC - Créer une nouvelle instance de customer dans la BD
    //--------------------
    create(customer) {
        return Customer.create(customer);
    }

    //--------------------
    // KS - Retrouve un client à partir de son id
    //--------------------
    retrieveById(idCustomer, options) {
        const retrieveQuery = Customer.findById(idCustomer);
        if (options.isOrdersEmbed) retrieveQuery.populate('orders');
        return retrieveQuery;
    }

    //--------------------
    // KS - Transforme les données du client pour le corps de la réponse
    //--------------------
    transform(customer, options) {
        customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
        customer.phone = `[${customer.phone.substring(0, 4)}]${customer.phone.substring(4, 8)}-${customer.phone.substring(8, 14)}@${customer.phone.substring(14, 16)}`;
        customer.age = this.calculateAge(customer.birthday);
        customer.lightspeed = `[${customer.planet}]@(${customer.coord.lat};${customer.coord.lon})`;

        if (options.isOrdersEmbed) customer.orders = customer.orders.map(o => ordersService.transform(o, { isCustomerEmbed: false }));

        delete customer._id;
        delete customer.__v;
        return customer;
    }

    //--------------------
    // KS - Calcule l'âge du client
    //--------------------
    calculateAge(birthday) {
        const today = dayjs(Date.now());
        return today.diff(birthday, 'year');
    }
}

export default new CustomersServices();
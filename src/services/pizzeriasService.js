// Fichier : pizzeriasService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de service pour la gestion des pizzerias dans la base de données

import ordersService from './ordersService.js';

import Pizzeria from '../models/pizzeria.js';

class pizzeriasService {

    //--------------------
    // KS - Crée une pizzeria dans la base de donnée
    //--------------------
    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    retrieveOrderById(idOrder, idPizzeria, options) {
        return ordersService.retrieveByCriteria({ _id: idOrder, pizzeria: idPizzeria }, options);
    }

    //--------------------
    // KS - Transforme les données de la pizzeria pour le corps de la réponse
    //--------------------
    transform(pizzeria) {
        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;

        delete pizzeria._id;
        delete pizzeria.__v;
        return pizzeria;
    }
}

export default new pizzeriasService();
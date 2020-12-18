// Fichier : pizzeriasService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de service pour la gestion des pizzerias dans la base de données

import Pizzeria from '../models/pizzeria.js';
import ordersService from './ordersService.js';
class pizzeriasService {

    //--------------------
    // KS - Crée une pizzeria dans la base de donnée
    //--------------------
    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    //--------------------
    // JC - Aller chercher toutes les pizzerias
    //--------------------
    retrieveAll(options) {
        let retrieveQuery;
        let countQuery;
        const criteria = {
            'chef.speciality':options.speciality
        }
        
        if (options.speciality) {
            retrieveQuery = Pizzeria.find(criteria);
            countQuery = Pizzeria.countDocuments(criteria);
        } else {
            retrieveQuery = Pizzeria.find();
            countQuery = Pizzeria.countDocuments();
        }
        retrieveQuery.limit(options.limit).skip(options.skip).sort('chef.name');

        return Promise.all([retrieveQuery, countQuery])
    }



    retrieveById(idPizzeria,options){
        const retrieveQuery = Pizzeria.findById(idPizzeria);

        if (options.isOrdersEmbed) {
            
            retrieveQuery.populate('orders');
        }

        return retrieveQuery;
    }

    //--------------------
    // KS - Transforme les données de la pizzeria pour le corps de la réponse
    //--------------------
    transform(pizzeria,options) {
        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;

        if(options.isOrdersEmbed){
            pizzeria.orders=pizzeria.orders.map(o=>{
               return ordersService.transform(o);
            });
        }

        delete pizzeria._id;
        delete pizzeria.__v;
        return pizzeria;
    }
}

export default new pizzeriasService();
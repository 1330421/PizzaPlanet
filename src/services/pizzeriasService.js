// Fichier : pizzeriasService.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de service pour la gestion des pizzerias dans la base de données

import Pizzeria from '../models/pizzeria.js'

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
    getAll(options) {
        let retrieveQuery;
        let docCount;
        
        if (options.speciality) {
            retrieveQuery = Pizzeria.find({'chef.speciality':options.speciality});
            docCount = countDocuments({'chef.speciality':options.speciality});
        } else {
            retrieveQuery = Pizzeria.find();
            docCount = countDocuments();
        }
        return Promise.all({retrieveQuery, docCount})
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
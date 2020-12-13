// Fichier : customersRoutes.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-12
// But : Fichier des routes pour la gestion des clients dans la base de données

import express from 'express';
import httpError from 'http-errors';

import customersService from '../services/customersService.js';

const router = express.Router();

class CustomersRoutes {

    constructor() {
        router.get('/:idCustomer', this.getOne);
    }

    //--------------------
    // KS - C4 - Tente d'obtenir un client
    //--------------------
    async getOne(req, res, next) {
        const options = { isOrdersEmbed: false };
        if (req.query.embed === 'orders') options.isOrdersEmbed = true;

        const idCustomer = req.params.idCustomer;
        try {
            let customer = await customersService.retrieveById(idCustomer, options);
            if (!customer) return next(httpError.NotFound(`Le client avec l'id ${idCustomer} n'existe pas.`)); // 404 // TODO Pas mon message qui affiche

            customer = customer.toObject({ virtuals: true });
            customer = customersService.transform(customer, options);
            res.status(200).json(customer); // 200
            
        } catch (error) {
            return next(error); // 500
        }
    }
}

new CustomersRoutes();
export default router;
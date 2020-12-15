// Fichier : ordersRoutes.js
// Auteur : Jordan Côté - JC
// Date : 2020-12-15
// But : Fichier pour la gestions des commandes dans la base de données

import express from 'express';
import httpError from 'http-errors';
import paginate from 'express-paginate';
import _ from 'lodash';

import ordersRoutes from '../services/ordersService.js';
import ordersService from '../services/ordersService.js';

const router = express.Router();

class OrdersRoutes {
    constructor() {
        //router.get('/', this.getAll());
        router.get('/pizzerias/:idPizzeria/orders/:idOrder', this.getOne);
    }

    //------------------------------------------//
    // KS - O1 - Aller chercher toutes les commandes
    //------------------------------------------//
    async getAll(req, res, next) {

    }

    //------------------------------------------//
    // KS - O2 - Aller chercher une commande spécifique d'une pizzeria
    //------------------------------------------//
    async getOne(req, res, next) {
        const options = {
            isCustomerEmbed: false
        }

        const criteria = {
            pizzeria: req.params.idPizzeria,
            _id: req.params.idOrder
        }

        if (req.query.embed === 'customer') {
            options.isCustomerEmbed = true;
        }

        try {
            let order = await ordersService.retrieveByCriteria(criteria, options)
            if (!order) {
                return next(httpError.NotFound(`Aucune commande avec l'identifiant ${req.params.idOrder}`));
            }

            // Transformation de la réponse
            order = order.toObject({virtuals: true});
            order = ordersService.transform(order, options);

            // Envoyer la réponse
            res.status(200).json(order);
        } catch (err) {
            return next(err);
        }
    }
}

new OrdersRoutes();

export default router;
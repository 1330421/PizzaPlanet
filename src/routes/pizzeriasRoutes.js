// Fichier : pizzeriasRoutes.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier des routes pour la gestion des pizzerias dans la base de données

import express from 'express';
import httpError from 'http-errors';
import _ from 'lodash';

import pizzeriasService from '../services/pizzeriasService.js';

import validator from '../utils/validator.js';
import pizzeriasRoutesValidators from '../validators/pizzeriasRoutesValidators.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.post('/', pizzeriasRoutesValidators.postValidator(), validator, this.post);
        router.get('/:idPizzeria/orders/:idOrder', this.getOneOrder);
    }

    //--------------------
    // KS - P3 - Tente d'ajouter une pizzeria
    //--------------------
    async post(req, res, next) {
        try {
            const newPizzeria = req.body;

            let pizzeria = await pizzeriasService.create(newPizzeria);
            pizzeria = pizzeria.toObject({ getters: false, virtuals: false });
            pizzeria = pizzeriasService.transform(pizzeria);

            res.header('Location', pizzeria.href);
            if (req.query._body === 'false') res.status(204).end(); // 204
            else res.status(201).json(pizzeria); // 201

        } catch (error) {
            return next(error); // 422 // 500
        }
    }

    async getOneOrder(req, res, next) {
        const options = { isCustomerEmbed: false };
        if (req.query.embed === 'customer') options.isCustomerEmbed = true;

        const idPizzeria = req.params.idPizzeria;
        const idOrder = req.params.idOrder;

        try {
            const order = await pizzeriasService.retrieveOrderById(idOrder, idPizzeria, options);

            console.log(order);

        } catch (error) {
            return next(error);
        }
    }
}

new PizzeriasRoutes();
export default router;
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
        router.post('/', this.post); // TODO utiliser le ficher de validation
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
}

new PizzeriasRoutes();
export default router;
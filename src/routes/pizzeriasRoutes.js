import express from 'express';
import error from 'http-errors';
import _ from 'lodash';

import pizzeriasService from '../services/pizzeriasService.js';
import pizzeriaRoutesValidators from '../validators/pizzeriasRoutesValidators.js';

import validator from '../helpers/validator.js';
import pizzeriasRoutesValidators from '../validators/pizzeriasRoutesValidators.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.post('/', this.post); // TODO utiliser le ficher de validation
    }

    async post(req, res, next) {

        try {
            const newPizzeria = req.body;

            let pizzeria = await pizzeriasService.create(newPizzeria);
            pizzeria = pizzeria.toObject({ getters: false, virtuals: false })
            pizzeria = pizzeriasService.transform(pizzeria);

            res.header('Location', pizzeria.href)
            if (req.query._body === 'false') res.status(204).end();
            else res.status(201).json(pizzeria);

        } catch (err) {
            return next(err);
        }
    }
}

new PizzeriasRoutes();
export default router;
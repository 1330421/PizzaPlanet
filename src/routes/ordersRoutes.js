// Fichier : ordersRoutes.js
// Auteurs : Jordan Côté - JC
// Kevin St-Pierre - KS
// Date : 2020-12-13
// But : Fichier des routes pour la gestion des commandes dans la base de données

import express from 'express';
import paginate from 'express-paginate';
import httpError from 'http-errors';
import _ from 'lodash';

import ordersService from '../services/ordersService.js';

const router = express.Router();

class OrdersRoutes {

    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll);
        router.get('/pizzerias/:idPizzeria/orders/:idOrder', this.getOne);
    }

    //--------------------
    // KS - O1 - Tente d'obtenir un client
    //--------------------
    async getAll(req, res, next) {
        const options = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        };
        if (req.query.topping) options.topping = req.query.topping;

        try {
            const [orders, documentsCount] = await ordersService.retrieveAll(options);

            const pageCount = Math.ceil(documentsCount / req.query.limit);
            const functionPages = paginate.getArrayPages(req);
            const pageArray = functionPages(3, pageCount, options.page);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            if (options.page > pageCount) return next(httpError.BadRequest(`La page ${req.query.page} n'existe pas pour la sélection de commande`));

            const transformOrders = orders.map(o => ordersService.transform(o.toObject()));

            const responseBody = {
                _links: {
                    prev: `${process.env.BASE_URL}${pageArray[0].url}`,
                    self: `${process.env.BASE_URL}${pageArray[1].url}`,
                    next: `${process.env.BASE_URL}${pageArray[2].url}`
                },
                result: transformOrders
            };

            // KS - Adapte les liens de page à la première page
            if (req.query.page === 1) {
                responseBody._links.next = responseBody._links.self;
                responseBody._links.self = responseBody._links.prev;
                delete responseBody._links.prev;
            }

            // KS - Adapte les liens de page à la dernière page
            if (!hasNextPage) {
                responseBody._links.prev = responseBody._links.self;
                responseBody._links.self = responseBody._links.next;
                delete responseBody._links.next;
            }

            res.status(200).json(responseBody); // 200
        } catch (error) {
            return next(console.error()); // 500
        }
    }

    //------------------------------------------
    // O2 - Aller chercher une commande spécifique d'une pizzeria
    //------------------------------------------
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

new OrdersRoutes()
export default router;
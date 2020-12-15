// Fichier : ordersRoutes.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-13
// But : Fichier des routes pour la gestion des commandes dans la base de données

import express from 'express';
import paginate, { hasNextPages } from 'express-paginate';
import httpError from 'http-errors';

import ordersService from '../services/ordersService.js';

const router = express.Router();

class OrdersRoutes {

    constructor() {
        router.get('/', paginate.middleware(10, 30), this.getAll);
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
}
new OrdersRoutes()
export default router;
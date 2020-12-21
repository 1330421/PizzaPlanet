// Fichier : pizzeriasRoutes.js
/* Auteurs
 Jordan Côté - JC
 Louis-Philippe Brunet - LB
 Kevin St-Pierre - KS
 */
// Date : 2020-12-05
// But : Fichier des routes pour la gestion des pizzerias dans la base de données

// Modules
import express from 'express';
import httpError from 'http-errors';
import paginate from 'express-paginate';
import _ from 'lodash';

// Services
import pizzeriasService from '../services/pizzeriasService.js';

// Validateurs
import validator from '../utils/validator.js';
import pizzeriasRoutesValidators from '../validators/pizzeriasRoutesValidators.js';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll)
        router.post('/', pizzeriasRoutesValidators.postValidator(), validator, this.post);
        router.get('/:idPizzeria', this.getOne);
    }

    //-----------------------------
    // JC - P1 - Tenter d'aller chercher toutes les pizzérias
    //-----------------------------
    async getAll(req, res, next) {
        const options = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        };

        if (req.query.speciality) {
            options.speciality = req.query.speciality;
        }

        try {
            const [pizzerias, documentsCount] = await pizzeriasService.retrieveAll(options);

            const pageCount = Math.ceil(documentsCount / req.query.limit);
            const functionPages = paginate.getArrayPages(req);
            const pageArray = functionPages(3, pageCount, req.query.page);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            // TODO Ici, l'énoncé ne demande pas de message d'erreur s'il n'y a pas de document
            // if (req.query.page > pageCount) {
            //     return next(httpError.BadRequest(`Page ${req.query.page} inexistante, il y a ${pageCount} pages dans la réponse.`));
            // }

            const transformPizzerias = pizzerias.map(p => {
                p = p.toObject({ virtuals: false });
                p = pizzeriasService.transform(p);
                return p;
            });

            const responseBody = {
                // TODO _metadata
                _links: {
                    prev: !(pageArray[0] == undefined) ? `${process.env.BASE_URL}${pageArray[0].url}` : null,
                    self: !(pageArray[1] == undefined) ? `${process.env.BASE_URL}${pageArray[1].url}` : null,
                    next: !(pageArray[2] == undefined) ? `${process.env.BASE_URL}${pageArray[2].url}` : null
                },
                results: transformPizzerias
            };

            switch (pageArray.length) {
                case 1: // Si on a seulement une page
                    responseBody._links.self = responseBody._links.prev;
                    delete responseBody._links.next
                    delete responseBody._links.prev;
                    break;
                case 2: // Si on a deux pages
                    if (req.query.page === 1) { // Si on est à la première page
                        responseBody._links.next = responseBody._links.self;
                        responseBody._links.self = responseBody._links.prev;
                        delete responseBody._links.prev;
                    }
                    if (!hasNextPage) { // Si on est à la dernière page et qu'on a seulement deux pages
                        delete responseBody._links.next;
                    }
                    break;

                default: // Si on a plus que deux page
                    if (req.query.page === 1) { // Si on est à la première page
                        responseBody._links.next = responseBody._links.self;
                        responseBody._links.self = responseBody._links.prev;
                        delete responseBody._links.prev;
                    }

                    if (!hasNextPage) { // Si on est à la dernière page
                        responseBody._links.prev = responseBody._links.self;
                        responseBody._links.self = responseBody._links.next;
                        delete responseBody._links.next;
                    }
                    break;
            }

            res.status(200).json(responseBody);
        } catch (error) {
            return next(error);
        }
    }

    //-----------------------------
    // LB - P2 - Tenter d'aller chercher une pizzeria spécifié
    //-----------------------------
    async getOne(req, res, next) {
        const options = {
            isOrdersEmbed: false
        };

        const idPizzeria = req.params.idPizzeria;

        if (req.query.embed === 'orders') {
            options.isOrdersEmbed = true;
        }
        try {
            let pizzeria = await pizzeriasService.retrieveById(idPizzeria, options);

            if (!pizzeria) {
                return next(httpError.NotFound(`La pizzeria avec l'identifiant ${idPizzeria} n'existe pas.`));
            }

            pizzeria = pizzeria.toObject({ virtuals: true });
            pizzeria = pizzeriasService.transform(pizzeria, options);
            res.status(200).json(pizzeria);
        } catch (error) {
            return next(error);
        }
    }

    //--------------------
    // KS - P3 - Tente d'ajouter une pizzeria
    //--------------------
    async post(req, res, next) {
        try {
            const newPizzeria = req.body;

            let pizzeria = await pizzeriasService.create(newPizzeria);
            pizzeria = pizzeriasService.transform(pizzeria.toObject());

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
// Fichier : pizzeriasRoutes.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier des routes pour la gestion des pizzerias dans la base de données

import express from 'express';
import httpError from 'http-errors';
import paginate from 'express-paginate';
import _ from 'lodash';

import pizzeriasService from '../services/pizzeriasService.js';

import validator from '../utils/validator.js';
import pizzeriasRoutesValidators from '../validators/pizzeriasRoutesValidators.js';
import e from 'express';

const router = express.Router();

class PizzeriasRoutes {

    constructor() {
        router.get('/', paginate.middleware(25, 50), this.getAll)
        router.post('/', pizzeriasRoutesValidators.postValidator(), validator, this.post);
        router.get('/:idPizzeria',this.getOne)
    }

    //-----------------------------
    // JC - P1 - Tenter d'aller chercher toutes les pizzérias
    //-----------------------------
    async getAll(req, res, next) { // WIP speciality not working
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
            console.log(pageCount);
            const functionPages = paginate.getArrayPages(req);
            const pageArray = functionPages(3, pageCount, req.query.page);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            if (req.query.page > pageCount) {
                return next(httpError.BadRequest());
            }

            const transformPizzerias = pizzerias.map(p => {
                p = p.toObject({virtuals:false});
                p = pizzeriasService.transform(p);
                return p;
            });

            console.log(req.query.page);

            const responseBody = {
                _links: {
                    prev: `${process.env.BASE_URL}${pageArray[0].url}`,
                    self: `${process.env.BASE_URL}${pageArray[1].url}`,
                    next: `${process.env.BASE_URL}${pageArray[2].url}` // Cannot read property 'url' of undefined
                },
                data: transformPizzerias
            };

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

            res.status(200).json(responseBody);
        } catch (err) {
            return next(err);
        }
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
    //-----------------------------
    // LB - P2 - Tenter d'aller chercher une pizzeria spécifié
    //-----------------------------
    async getOne(req,res,next){

        const options = {
            isOrdersEmbed:false
        };

        const idPizzeria=req.params.idPizzeria;

        if (req.query.embed==='orders') {
            options.isOrdersEmbed=true;
        }
        try {

            let pizzeria =await pizzeriasService.retrieveById(idPizzeria,options);

            if(!pizzeria){
                return next(httpError.NotFound(`La pizzeria avec l'identifiant ${idPizzeria} n'existe pas.`))
            }
        
            pizzeria=pizzeria.toObject({virtuals:true});
            pizzeria=pizzeriasService.transform(pizzeria,options);
            res.status(200).json(pizzeria);
        } catch (error) {
            return next(error);
        }
    }


}

new PizzeriasRoutes();
export default router;
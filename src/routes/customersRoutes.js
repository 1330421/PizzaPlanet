// Fichier : customersRoutes.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-12
// But : Fichier des routes pour la gestion des clients dans la base de données

import express from "express";
import httpError from "http-errors";
import _ from "lodash";
import paginate from "express-paginate";
import customersService from "../services/customersService.js";
import customersRoutesValidators from "../validators/customersRoutesValidators.js";
import error from "../utils/error.js";
import validator from "../utils/validator.js";

const router = express.Router();

class CustomersRoutes {
  constructor() {
    router.get("/:idCustomer", this.getOne);
    router.put(
      "/:idCustomer",
      customersRoutesValidators.postValidator(),
      validator,
      this.put
    );
    router.post(
      "/",
      customersRoutesValidators.postValidator(),
      validator,
      this.post
    );
    router.get("/", paginate.middleware(20, 40), this.getAll);
  }

  //--------------------
  // LB -C3  - Tente d'obtenir tout les client
  //--------------------

  async getAll(req, res, next) {
    const options = {
      limit: req.query.limit,
      page: req.query.page,
      skip: req.skip,
    };

    if (req.query.planet) {
      options.planet = req.query.planet;
    }
    try {
      const [customers, documentsCount] = await customersService.retrieveAll(
        options
      );
      const pageCount = Math.ceil(documentsCount / req.query.limit);
      const functionPages = paginate.getArrayPages(req);
      const pageArray = functionPages(3, pageCount, req.query.page);
      const hasNextPage = paginate.hasNextPages(req)(pageCount);

      if (req.query.page > pageCount) {
        return next(httpError.BadRequest());
      }

      const transformCustomers = customers.map((c) => {
        c = c.toObject({ virtuals: false });
        c = customersService.transform(c);
        return c;
      });

      const responseBody = {
        _links: {
          prev: !(pageArray[0] == undefined)
            ? `${process.env.BASE_URL}${pageArray[0].url}`
            : null,
          self: !(pageArray[1] == undefined)
            ? `${process.env.BASE_URL}${pageArray[1].url}`
            : null,
          next: !(pageArray[2] == undefined)
            ? `${process.env.BASE_URL}${pageArray[2].url}`
            : null,
        },
        data: transformCustomers,
      };

      switch (pageArray.length) {
        case 1:
          if (req.query.page === 1) {
            // Si on a seulement une page.
            responseBody._links.self = responseBody._links.prev;
            delete responseBody._links.next;
            delete responseBody._links.prev;
          }
          break;
        case 2:
          if (req.query.page === 1) {
            // Si on est à la première page
            responseBody._links.next = responseBody._links.self;
            responseBody._links.self = responseBody._links.prev;
            delete responseBody._links.prev;
          }
          if (!hasNextPage) {
            // Si on est à la dernière page et qu'on a seulement deux pages
            delete responseBody._links.next;
          }
          break;

        default:
          // Si on a plus que deux page
          if (req.query.page === 1) {
            // Si on est à la première page
            responseBody._links.next = responseBody._links.self;
            responseBody._links.self = responseBody._links.prev;
            delete responseBody._links.prev;
          }

          if (!hasNextPage) {
            // Si on est à la dernière page
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
  //--------------------
  // KS - C4 - Tente d'obtenir un client
  //--------------------
  async getOne(req, res, next) {
    const options = { isOrdersEmbed: false };
    if (req.query.embed === "orders") options.isOrdersEmbed = true;

    const idCustomer = req.params.idCustomer;
    try {
      let customer = await customersService.retrieveById(idCustomer, options);
      if (!customer)
        return next(
          httpError.NotFound(`Le client avec l'id ${idCustomer} n'existe pas.`)
        ); // 404

      customer = customer.toObject({ virtuals: true });
      customer = customersService.transform(customer, options);
      res.status(200).json(customer); // 200
    } catch (error) {
      return next(error); // 500
    }
  }

  //--------------------
  // JC - C1 - Tenter d'ajouter un client
  //--------------------
  async post(req, res, next) {
    if (_.isEmpty(req.body)) {
      return next(httpError.BadRequest()); // Err 400
    }

    try {
      const nvCsr = req.body;

      let customer = await customersService.create(nvCsr);

      customer = customer.toObject({ virtuals: false });
      customer = customersService.transform(customer, {});

      res.header("Location", customer.planet);
      if (req.query._body === "false") {
        res.status(204).end(); // No content
      } else {
        res.status(201).json(customer); // Created
      }
    } catch (err) {
      return next(err);
    }
  }

  //--------------------
  // LB - C2 - Tenter de modifier un customer
  //--------------------
  async put(req, res, next) {
    try {
      if (await customersService.emailValidation(req.body)) {
        return next(httpError.Conflict(`L'adresse de courriel existe deja.`));
      }
      let customerMod = await customersService.update(
        req.params.idCustomer,
        req.body
      );
      if (!customerMod) {
        return next(
          httpError.NotFound(
            `Le customer ${req.params.idCustomer} n'existe pas.`
          )
        );
      }

      customerMod = customerMod.toObject({ getters: false, virtuals: false });
      customerMod = customersService.transform(customerMod);

      if (req.query._body === "false") {
        return res.status(204).end();
      }
      res.status(201).json(customerMod);
    } catch (error) {
      return next(error);
    }
  }
}

new CustomersRoutes();
export default router;

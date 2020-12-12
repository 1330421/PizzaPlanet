import expressValidator from 'express-validator';
import { PLANET_NAMES, COORD, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../utils/constants.js';

const { body } = expressValidator;

class PizzeriaRoutesValidators {

    postValidator() {
        return [
            this.validatePlanet(),
            this.validateCoord(),
            this.validateChef()
        ];
    }

    //--------------------
    // Valide le nom de la planet
    //--------------------
    validatePlanet() {
        body('planet')
            .exists().withMessage(`Le nom de la planet doit être metionné.`).bail()
            .isIn(PLANET_NAMES).withMessage('La planète mentionnée n\'est pas répertorié');
    }

    //--------------------
    // Valide les coordonnées
    //--------------------
    validateCoord() {
        return [
            body('coord.lat')
                .exists().withMessage('La latitude doit être mentionnéea').bail()
                .isFloat({ min: COORD.MIN, max: COORD.MAX }).withMessage(`La latitiude doit être entre ${COORD.MIN} et ${COORD.MAX}`),
            body('coord.lon')
                .exists().withMessage('La longitude doit être mentionnée').bail()
                .isFloat({ min: COORD.MIN, max: COORD.MAX }).withMessage(`La longitude doit être entre ${COORD.MIN} et ${COORD.MAX}`),
        ];
    }

    //--------------------
    // Valide les informations du chef
    //--------------------
    validateChef() {
        return [
            body('chef.name').exists().withMessage(`Le nom du chef doit être mentionné.`),
            body('chef.ancestor')
                .exists().withMessage(`L'ancêtre du chef doit être mentionné.`).bail()
                .isIn(MONSTER_ANCESTORS).withMessage(`L'ancêtre du chef n'est pas répertorié.`),
            body('chef.speciality')
                .exists().withMessage(`La spécialité du chef doit être mentionnée.`)
                .isIn(PIZZA_TOPPINGS).withMessage(`La spécialité du chef n'est pas répertoriée.`),
        ];
    }
}

export default new PizzeriaRoutesValidators();
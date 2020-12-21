// Fichier : pizzeriasRoutesValidators.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de validation pour l'ajout ou la modification d'une pizzeria

import expressValidator from 'express-validator';
import globalValidators from './globalsValidators.js';
import { MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../utils/constants.js';

const { body } = expressValidator;

class PizzeriaRoutesValidators {

    postValidator() {
        return [
            ...globalValidators.validatePlanet(),
            ...globalValidators.validateCoord(),
            ...this.validateChef()
        ];
    }

    //--------------------
    // KS - Valide les informations du chef
    //--------------------
    validateChef() {
        return [
            body('chef.name').exists().withMessage(`Le nom du chef doit être mentionné.`),
            body('chef.ancestor')
                .exists().withMessage(`L'ancêtre du chef doit être mentionné.`).bail()
                .isIn(MONSTER_ANCESTORS).withMessage(`L'ancêtre du chef n'est pas répertorié.`),
            body('chef.speciality')
                .exists().withMessage(`La spécialité du chef doit être mentionnée.`).bail()
                .isIn(PIZZA_TOPPINGS).withMessage(`La spécialité du chef n'est pas répertoriée.`),
        ];
    }
}

export default new PizzeriaRoutesValidators();
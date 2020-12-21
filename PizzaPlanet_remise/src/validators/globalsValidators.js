// Fichier : pizzeriasRoutesValidators.js
// Auteurs : Kevin St-Pierre - KS
// Date : 2020-12-05
// But : Fichier de validation globale

import expressValidator from 'express-validator';
import { PLANET_NAMES, COORD } from '../utils/constants.js';

const { body } = expressValidator;

class PizzeriaRoutesValidators {

    //--------------------
    // KS - Valide le nom de la planet
    //--------------------
    validatePlanet() {
        return [
            body('planet')
                .exists().withMessage(`Le nom de la planet doit être metionné.`).bail()
                .isIn(PLANET_NAMES).withMessage('La planète mentionnée n\'est pas répertoriée')
        ];
    }

    //--------------------
    // KS - Valide les coordonnées
    //--------------------
    validateCoord() {
        return [
            body('coord.lat')
                .exists().withMessage('La latitude doit être mentionnée').bail()
                .isFloat({ min: COORD.MIN, max: COORD.MAX }).withMessage(`La latitiude doit être entre ${COORD.MIN} et ${COORD.MAX}`),
            body('coord.lon')
                .exists().withMessage('La longitude doit être mentionnée').bail()
                .isFloat({ min: COORD.MIN, max: COORD.MAX }).withMessage(`La longitude doit être entre ${COORD.MIN} et ${COORD.MAX}`),
        ];
    }
}

export default new PizzeriaRoutesValidators();
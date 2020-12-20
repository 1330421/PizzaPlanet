// Fichier : pizzeriasRoutesValidators.js
/* Auteurs
 Jordan Côté - JC
 Kevin St-Pierre - KS
 */
// Date : 2020-12-05
// But : Fichier de validation pour l'ajout ou la modification d'un client

import expressValidator from 'express-validator';
import globalValidators from './globalsValidators.js';

const { body } = expressValidator;

class CustomersRoutesValidators {

    postValidator() {
        return [
            ...this.validateName(),
            ...this.validateEmail(),
            ...globalValidators.validatePlanet(),
            ...globalValidators.validateCoord(),
            ...this.validatePhone(),
            ...this.validateBirthday()
        ];
    }

    //--------------------
    // KS - Valide le nom du client
    //--------------------
    validateName() {
        return [body('name').exists().withMessage('Le nom du client doit être mentionné.')];
    }

    //--------------------
    // KS - Valide l'adresse courriel du client
    //--------------------
    validateEmail() {
        return [
            body('email')
                .exists().withMessage('L\'adresse courriel du client doit être mentionnée.').bail()
                .isEmail().withMessage('L\'adresse courriel du client est invalide.').bail()
        ];
    }

    //--------------------
    // KS - Valide le numéro de téléphone du client
    //--------------------
    validatePhone() {
        return [
            body('phone')
                .exists().withMessage('Le numéro de téléphone du client doit être mentionné.').bail()
                .isLength({ min: 16, max: 16 }).withMessage('Le numéro de téléphone doit du client doit contenir 16 caractères.').bail()
                .isHexadecimal().withMessage('Le numéro de téléphone du client doit être hexadécimal').bail()
        ];
    }

    //--------------------
    // KS - Valide la date de naissance du client
    //--------------------
    validateBirthday() {
        return [
            body('birthday')
                .exists().withMessage('La date de naissance du client doit être mentionnée.').bail()
                .isDate().withMessage('La date de naissance du client doit avoir le format YYYY-MM-DD.').bail()
        ];
    }
}

export default new CustomersRoutesValidators();
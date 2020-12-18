import expressValidator from 'express-validator';
import { PLANET_NAMES } from '../utils/constants.js';

const { body } = expressValidator;

class CustomersRoutesValidators {
    
    postValidator() {
        return [
            body('email').exists().bail().isEmail().bail(),
            body('phone').exists().withMessage('Le numéro de téléphone est obligatoire.').bail()
            .isString(16, 16).withMessage('Le numéro de téléphone doit être 16 caractère de long.').bail()
            .isHexadecimal().withMessage('Le numéro doit être un hexadécimal.').bail(),
            body('planet').exists().withMessage(`Le nom de la planet doit être metionné.`).bail()
            .isIn(PLANET_NAMES).withMessage('La planète mentionnée n\'est pas répertorié')
        ]
    }
}

export default new CustomersRoutesValidators();
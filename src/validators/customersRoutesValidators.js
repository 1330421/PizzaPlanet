import expressValidator from 'express-validator';

const { body } = expressValidator;

class CustomersRoutesValidators {
    
    postValidator() {
        return [
            body('email').exists().bail().isEmail().bail(),
            body('phone').exists().withMessage('Le numéro de téléphone est obligatoire.').bail()
            .isString(16, 16).withMessage('Le numéro de téléphone doit être 16 caractère de long.').bail()
            .isHexadecimal().withMessage('Le numéro doit être un hexadécimal.').bail()
        ]
    }
}

export default new CustomersRoutesValidators();
import expressValidator from 'express-validator';

const { body } = expressValidator;

class CustomersRoutesValidators {
    getValidator() {
        return [
            body('email').exists().bail()
            .isEmail().bail(),
            body('phone').exists().withMessage('Le numéro de téléphone est obligatoire').bail()
            .isString(16,16).bail()
            .isHexadecimal().bail(),
        ];
    }
    postValidator() {
        return [
            body('email').exists().bail().isEmail().bail(),
        ]
    }

}

export default new CustomersRoutesValidators();
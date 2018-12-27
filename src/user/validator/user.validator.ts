import { Request, Response, NextFunction } from 'express';
import { UserValidations } from './user.validations';
import { PropertyInvalidError, IdInvalidError, NameInvalidError, MailInvalidError } from '../../utils/errors/userErrors';
import { IUser } from '../user.interface';

export class UserValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            UserValidator.validateId(req.body.id) ||
            UserValidator.vali);
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            UserValidator.validateId(req.params.id) ||
            UserValidator.validateProperty(req.body.property));
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(UserValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(UserValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateId(id: string) {
        if (!UserValidations.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static validateName(firstname: string, lastname: string) {
        if (!UserValidations.isFirstnameValid(firstname) ||
            !UserValidations.isLastnameValid(lastname)) {
            return new NameInvalidError();
        }

        return undefined;
    }

    private static getNextValueFromArray(validationsArray: (Error | undefined)[]) {
        let nextValue: Error | undefined;

        for (let index = 0; index < validationsArray.length; index++) {
            if (validationsArray[index] !== undefined) {
                nextValue = validationsArray[index];
            }
        }

        return nextValue;
    }
}

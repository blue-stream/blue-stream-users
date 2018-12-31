import { Request, Response, NextFunction } from 'express';
import { UserValidations } from './user.validations';
import { IdInvalidError, NameInvalidError, MailInvalidError } from '../../utils/errors/userErrors';
import { IUser } from '../user.interface';

export class UserValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            UserValidator.validateId(req.body._id) ||
            UserValidator.validateName(req.body.firstName, req.body.lastName) ||
            UserValidator.validateMail(req.body.mail));
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            UserValidator.validateId(req.params.id) ||
            UserValidator.validatePartialUser(req.body));
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

    private static validateName(firstName: string, lastName: string) {
        if (!UserValidations.isFirstnameValid(firstName) ||
            !UserValidations.isLastnameValid(lastName)) {
            return new NameInvalidError();
        }

        return undefined;
    }

    private static validateMail(mail: string) {
        if (!UserValidations.isMailValid(mail)) {
            return new MailInvalidError();
        }

        return undefined;
    }

    private static validatePartialUser(user: Partial<IUser>) {
        if (!user.firstName || !UserValidations.isFirstnameValid(user.firstName)) return new NameInvalidError('firstname is invalid');
        if (!user.lastName || !UserValidations.isLastnameValid(user.lastName)) return new NameInvalidError('lastName is invalid');
        if (!user.mail || !UserValidations.isMailValid(user.mail)) return new MailInvalidError();

        return undefined;
    }
}

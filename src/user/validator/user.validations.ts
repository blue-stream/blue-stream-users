import { Types } from 'mongoose';
import { config } from '../../config';

export class UserValidations {
    static isFirstnameValid(firstname: string): boolean {
        return (
            (!!firstname) &&
            firstname.length >= config.validator.user.firstname.minLength &&
            firstname.length <= config.validator.user.firstname.maxLength
        );
    }

    static isLastnameValid(lastname: string): boolean {
        return (
            (!!lastname) &&
            lastname.length >= config.validator.user.lastname.minLength &&
            lastname.length <= config.validator.user.lastname.maxLength
        );
    }

    static isMailValid(mail: string): boolean {
        return (
            (!!mail) &&
            config.validator.user.email.test(mail)
        );
    }

    static isIdValid(id: string): boolean {
        return (
            (!!id) &&
            config.validator.user.id.test(id)
        );
    }
}

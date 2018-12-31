import { Types } from 'mongoose';
import { config } from '../../config';

export class UserValidations {
    static isPropertyExsists(property: string): boolean {
        return (!!property);
    }

    static isFirstnameValid(firstname: string): boolean {
        return (
            UserValidations.isPropertyExsists(firstname) &&
            firstname.length >= config.validator.user.firstname.minLength &&
            firstname.length <= config.validator.user.firstname.maxLength
        );
    }

    static isLastnameValid(lastname: string): boolean {
        return (
            UserValidations.isPropertyExsists(lastname) &&
            lastname.length >= config.validator.user.lastname.minLength &&
            lastname.length <= config.validator.user.lastname.maxLength
        );
    }

    static isMailValid(mail: string): boolean {
        return (
            UserValidations.isPropertyExsists(mail) &&
            config.validator.user.email.test(mail)
        );
    }

    static isIdValid(id: string): boolean {
        return (
            UserValidations.isPropertyExsists(id) &&
            config.validator.user.id.test(id)
        );
    }
}

import { UserError } from './applicationError';

export class PropertyInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Property is invalid', 400);
    }
}

export class IdInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Id is invalid', 400);
    }
}

export class NameInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Name is invalid', 400);
    }
}

export class MailInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Mail is invalid', 400);
    }
}

export class UserNotFoundError extends UserError {
    constructor(message?: string) {
        super(message || 'User not found', 404);
    }
}

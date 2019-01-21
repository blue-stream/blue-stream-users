import { IUser } from './user.interface';
import { UserRepository } from './user.repository';
import { config } from '../config';

export class UserManager {

    static create(user: IUser) {
        return UserRepository.create(user);
    }

    static updateById(id: string, user: Partial<IUser>) {
        return UserRepository.updateById(id, user);
    }

    static deleteById(id: string) {
        return UserRepository.deleteById(id);
    }

    static getById(id: string) {
        return UserRepository.getById(id);
    }

    static getMany(userFilter: Partial<IUser>, startIndex?: number, endIndex?: number, sortOrder?: string, sortBy?: string) {
        return UserRepository.getMany(
            userFilter,
            startIndex || config.pagination.startIndex,
            endIndex || config.pagination.endIndex,
            sortOrder || config.sort.sortOrder,
            sortBy || config.sort.sortBy,
        );
    }

    static getAmount(userFilter: Partial<IUser>) {
        return UserRepository.getAmount(userFilter);
    }
}

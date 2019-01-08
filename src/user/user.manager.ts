import { IUser } from './user.interface';
import { UserRepository } from './user.repository';
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
        return UserRepository.getMany(userFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static getAmount(userFilter: Partial<IUser>) {
        return UserRepository.getAmount(userFilter);
    }
}

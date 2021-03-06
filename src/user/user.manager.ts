import { IUser } from './user.interface';
import { UserRepository } from './user.repository';
import { RPCClient } from '../utils/rpc.client';
import { config } from '../config';

export class UserManager {

    static create(user: IUser) {
        if (!user.firstName) {
            user.firstName = user.id;
        }

        if (!user.lastName) {
            user.lastName = "user";
        }

        return UserRepository.create(user);
    }

    static createUserChannel(user: IUser) {
        if (!user.firstName) {
            user.firstName = user.id;
        }

        if (!user.lastName) {
            user.lastName = "user";
        }

        return RPCClient.createUserChannel({ id: user.id, name: `${user.firstName} ${user.lastName}` });
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

    static async getByIds(ids: string[]): Promise<{ [id: string]: IUser }> {
        const users = await UserRepository.getByIds(ids);
        const usersMap: { [id: string]: IUser } = {};

        users.forEach((user: IUser) => {
            usersMap[user.id] = user;
        });

        return usersMap;
    }

    static getAmount(userFilter: Partial<IUser>) {
        return UserRepository.getAmount(userFilter);
    }

    static getSearched(
        searchFilter: string,
        startIndex?: number,
        endIndex?: number,
        sortOrder?: '-' | '',
        sortBy?: string) {
        return UserRepository.getSearched(searchFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static getSearchedAmount(searchFilter: string) {
        return UserRepository.getSearchedAmount(searchFilter);
    }
}

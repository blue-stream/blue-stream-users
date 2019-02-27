import { IUser } from './user.interface';
import { UserRepository } from './user.repository';
import { ChannelsRpc } from '../channel/channel.rpc';
import { config } from '../config';
import { IChannel } from '../channel/channel.interface';

export class UserManager {

    static create(user: IUser) {
        return UserRepository.create(user);
    }

    static async createUserProfile(user: IUser) {
        const userProfile: IChannel = {
            user: user.id.toLowerCase(),
            name: `${user.firstName} ${user.lastName}`,
            description: config.channels.defaultProfileDesc,
            isProfile: true,
        };

        return await ChannelsRpc.createUserProfile(userProfile);
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

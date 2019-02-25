import { UserManager } from '../user/user.manager';
import { IUser } from '../user/user.interface';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    getUsersByIds(ids: string[]) {
        return UserManager.getByIds(ids);
    },

    getUserById(user: { id: string }) {
        return UserManager.getById(user.id);
    },

    async createUser(user: IUser) {
        const createdUser = await UserManager.create(user);
        await UserManager.createUserProfile(user);
        return createdUser;
    },
});

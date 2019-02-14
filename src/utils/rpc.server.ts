import { UserManager } from '../user/user.manager';
import { IUser } from '../user/user.interface';
import { ClassificationManager } from '../classification/classification.manager';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    getUsersByIds(ids: string[]) {
        return UserManager.getByIds(ids);
    },

    getUserById(user: { id: string }) {
        return UserManager.getById(user.id);
    },

    createUser(user: IUser) {
        return UserManager.create(user);
    },

    getUserClassifications(user: { id: string }) {
        return ClassificationManager.getUserClassifications(user.id);
    },
});

import { UserManager } from '../user/user.manager';
import { IUser } from '../user/user.interface';
import { ClassificationManager } from '../classification/classification.manager';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    getUsersByIds(ids: string[]) {
        return UserManager.getByIds(ids);
    },

    async getUserById(user: { id: string }) {
        const userData: any = await UserManager.getById(user.id);
        const classifications = await ClassificationManager.getUserClassifications(user.id);

        return {
            ...userData.toObject(),
            classifications,
        };
    },

    createUser(user: IUser) {
        return UserManager.create(user);
    },

    getUserClassifications(user: { id: string }) {
        return ClassificationManager.getUserClassifications(user.id);
    },
});

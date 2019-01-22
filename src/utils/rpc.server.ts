import { UserManager } from "../user/user.manager";

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    async getUsersByIds(ids: string[]) {
        return UserManager.getByIds(ids);
    },
});

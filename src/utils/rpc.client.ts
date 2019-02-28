import { config } from '../config';

const jayson = require('jayson/promise');

export class ClientRpc {
    private static rpcClient = jayson.Client.http(`${config.channels.endpoint}:${config.channels.port}`);

    static async createUserChannel(user: { id: string, name: string }) {
        const response = await ClientRpc.rpcClient.request(config.channels.methods.CREATE_USER_PROFILE, user);

        return response.result;
    }
}

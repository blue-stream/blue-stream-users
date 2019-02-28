import { config } from '../config';
import { IChannel } from '../channel/channel.interface';

const jayson = require('jayson/promise');

export class ClientRpc {
    private static rpcClient = jayson.Client.http(`${config.channels.endpoint}:${config.channels.port}`);

    static async createUserChannel(user: { id: string, name: string }) {
        const response = await ClientRpc.rpcClient.request(config.channels.methods.CREATE_USER_PROFILE, user);

        return response.result;
    }
}

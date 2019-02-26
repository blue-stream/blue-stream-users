import { config } from '../config';
import { IChannel } from './channel.interface';

const jayson = require('jayson/promise');

export class ChannelsRpc {
    private static rpcClient = jayson.Client.http(`${config.channels.endpoint}:${config.channels.port}`);

    static async createUserProfile(channel: IChannel) {
        const response = await ChannelsRpc.rpcClient.request(config.channels.methods.CREATE_USER_PROFILE, channel);

        return response.result;
    }
}

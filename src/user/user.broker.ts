
import * as rabbit from '../utils/rabbit';

export class UserBroker {

    public static async publish(exchange: string, routingKey: string, message: any) {
        rabbit.publish('application', routingKey, message);
    }

    public static async subscribe() {
        rabbit.subscribe(
            'application',
            'topic',
            'user-action-queue',
            'sourceMicroserivce.entity.action.status',
            async (data: any) => { console.log(`got this message: ${data}`); });
    }

}

import { Response } from 'express';

export class HealthController {
    static async healthCheck(res: Response) {
        return res.sendStatus(200).send();
    }
}
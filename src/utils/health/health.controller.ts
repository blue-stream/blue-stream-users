import { Response } from 'express';

export class HealthController {
    static healthCheck(res: Response) {
        return res.sendStatus(200);
    }
}

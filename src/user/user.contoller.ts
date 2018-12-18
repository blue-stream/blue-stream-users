import { Request, Response } from 'express';
import { UserManager } from './user.manager';

import { UserNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class UserController {
    static async create(req: Request, res: Response) {
        res.json(await UserManager.create(req.body));
    }

    static async createMany(req: Request, res: Response) {
        res.json(await UserManager.createMany(req.body));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await UserManager.updateById(req.params.id, req.body.user);
        if (!updated) {
            throw new UserNotFoundError();
        }

        res.json(updated);
    }

    static async updateMany(req: Request, res: Response) {

        const updated: UpdateResponse = await UserManager.updateMany(req.query, req.body);

        if (updated.n === 0) {
            throw new UserNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await UserManager.deleteById(req.params.id);
        if (!deleted) {
            throw new UserNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const user = await UserManager.getById(req.params.id);
        if (!user) {
            throw new UserNotFoundError();
        }

        res.json(user);
    }

    static async getOne(req: Request, res: Response) {
        const user = await UserManager.getOne(req.query);
        if (!user) {
            throw new UserNotFoundError();
        }

        res.json(user);
    }

    static async getMany(req: Request, res: Response) {
        res.json(await UserManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await UserManager.getAmount(req.query));
    }
}

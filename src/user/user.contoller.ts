import { Request, Response } from 'express';
import { UserManager } from './user.manager';
import { UserNotFoundError } from '../utils/errors/userErrors';
import { IUser } from './user.interface';

export class UserController {
    static async create(req: Request, res: Response) {
        res.json(await UserManager.create(req.body));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await UserManager.updateById(req.params.id, req.body.user);
        if (!updated) {
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
        let sortOrder: string;
        let sortBy: string;
        let startIndex: number;
        let endIndex: number;
        const userFilter: Partial<IUser> = {
            firstName: req.query.firstname,
            lastName: req.query.lastname,
            mail: req.query.mail,
        };

        req.query.startIndex ? startIndex = req.query.startIndex : startIndex = 0;
        req.query.endIndex ? endIndex = req.query.endIndex : endIndex = 20;
        req.query.sortOrder ? sortOrder = req.query.sortOrder : sortOrder = '-';
        req.query.sortBy ? sortBy = req.query.sortBy : sortBy = 'createdAt';

        Object.keys(userFilter).forEach((key: string) => {
            return userFilter[key as keyof IUser] ===
                undefined && delete userFilter[key as keyof IUser];
        });

        res.json(await UserManager.getMany(req.query, startIndex, endIndex, sortOrder, sortBy));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await UserManager.getAmount(req.query));
    }
}

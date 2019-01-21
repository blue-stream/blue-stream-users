import { Request, Response } from 'express';
import { UserManager } from './user.manager';
import { UserNotFoundError } from '../utils/errors/userErrors';
import { IUser } from './user.interface';

export class UserController {
    static async create(req: Request, res: Response) {
        res.json(await UserManager.create(req.body));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await UserManager.updateById(req.params.id, req.body);
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

    static async getMany(req: Request, res: Response) {
        const userFilter: Partial<IUser> = {
            firstName: req.query.firstName,
            lastName: req.query.lastName,
            mail: req.query.mail,
        };

        Object.keys(userFilter).forEach((key: string) => {
            return userFilter[key as keyof IUser] ===
                undefined && delete userFilter[key as keyof IUser];
        });

        res.json(
            await UserManager.getMany(
                userFilter,
                req.query.startIndex,
                req.query.endIndex,
                req.query.sortOrder,
                req.query.sortBy,
            ),
        );
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await UserManager.getAmount(req.query));
    }
}

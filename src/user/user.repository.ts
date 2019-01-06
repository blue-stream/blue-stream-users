import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';

export class UserRepository {
    static create(user: IUser): Promise<IUser> {
        return UserModel.create(user);
    }

    static updateById(id: string, user: Partial<IUser>): Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(id, user, { new: true, runValidators: true }).exec();
    }

    static deleteById(id: string): Promise<IUser | null> {
        return UserModel.findByIdAndRemove(id).exec();
    }

    static getById(id: string): Promise<IUser | null> {
        return UserModel.findById(id).exec();
    }

    static getMany(
        userFilter: Partial<IUser>,
        startIndex: number = config.router.getMany.startIndex,
        endIndex: number = config.router.getMany.endIndex,
        sortOrder: string = config.router.getMany.sortOrder,
        sortBy: string = config.router.getMany.sortBy): Promise<IUser[]> {
        return UserModel
            .find(userFilter)
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit((+endIndex) - (+startIndex))
            .exec();
    }

    static getAmount(userFilter: Partial<IUser>): Promise<number> {
        return UserModel.countDocuments(userFilter).exec();
    }
}

import { IUser } from './user.interface';
import { UserModel } from './user.model';
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

    static getOne(userFilter: Partial<IUser>): Promise<IUser | null> {
        if (Object.keys(userFilter).length === 0) {
            throw new ServerError('Filter is required.');
        }
        return UserModel.findOne(userFilter).exec();
    }

    static getMany(userFilter: Partial<IUser>, startIndex: number, endIndex: number, sortOrder: string = '-', sortBy: string = 'createdAt'): Promise<IUser[]> {
        return UserModel
            .find(userFilter)
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(+endIndex - +startIndex)
            .exec();
    }

    static getAmount(userFilter: Partial<IUser>): Promise<number> {
        return UserModel.countDocuments(userFilter).exec();
    }
}

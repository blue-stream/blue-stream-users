import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { config } from '../config';

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

    static getByIds(ids: string[]): Promise<IUser[]> {
        return UserModel.find({
            _id: { $in: ids },
        }).exec();
    }

    static getMany(
        userFilter: Partial<IUser>,
        startIndex: number = config.pagination.startIndex,
        endIndex: number = config.pagination.endIndex,
        sortOrder: string = config.sort.sortOrder,
        sortBy: string = config.sort.sortBy,
    ): Promise<IUser[]> {
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

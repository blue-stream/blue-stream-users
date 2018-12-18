import { IUser } from './user.interface';
import { UserModel } from './user.model';
import { ServerError } from '../utils/errors/applicationError';

export class UserRepository {
    static create(user: IUser)
        : Promise<IUser> {
        return UserModel.create(user);
    }

    static createMany(users: IUser[])
        : Promise<IUser[]> {
        return UserModel.insertMany(users);
    }

    static updateById(id: string, user: Partial<IUser>)
        : Promise<IUser | null> {
        return UserModel.findByIdAndUpdate(
            id,
            { $set: user },
            { new: true, runValidators: true },
        ).exec();
    }

    static updateMany(userFilter: Partial<IUser>, user: Partial<IUser>)
        : Promise<any> {

        if (Object.keys(user).length === 0) {
            throw new ServerError('Update data is required.');
        }

        return UserModel.updateMany(
            userFilter,
            { $set: user },
        ).exec();
    }

    static deleteById(id: string)
        : Promise<IUser | null> {
        return UserModel.findByIdAndRemove(
            id,
        ).exec();
    }

    static getById(id: string)
        : Promise<IUser | null> {
        return UserModel.findById(
            id,
        ).exec();
    }

    static getOne(userFilter: Partial<IUser>)
        : Promise<IUser | null> {
        if (Object.keys(userFilter).length === 0) {
            throw new ServerError('Filter is required.');
        }
        return UserModel.findOne(
            userFilter,
        ).exec();
    }

    static getMany(userFilter: Partial<IUser>)
        : Promise<IUser[]> {
        return UserModel.find(
            userFilter,
        ).exec();
    }

    static getAmount(userFilter: Partial<IUser>)
        : Promise<number> {
        return UserModel
            .countDocuments(userFilter)
            .exec();
    }
}

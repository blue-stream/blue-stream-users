import * as mongoose from 'mongoose';
import { IUser } from './user.interface';

const userSchema: mongoose.Schema = new mongoose.Schema(
    {
        property: { type: String, required: true },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const UserModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

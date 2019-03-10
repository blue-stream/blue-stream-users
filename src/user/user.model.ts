import * as mongoose from 'mongoose';
import { IUser } from './user.interface';
import { UserValidations } from './validator/user.validations';

const userSchema: mongoose.Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
            validate: {
                validator: UserValidations.isIdValid,
            },
        },
        firstName: {
            type: String,
            required: true,
            validate: {
                validator: UserValidations.isFirstnameValid,
            },
        },
        lastName: {
            type: String,
            required: true,
            validate: {
                validator: UserValidations.isLastnameValid,
            },
        },
        mail: {
            type: String,
            required: true,
            validate: {
                validator: UserValidations.isMailValid,
            },
            unique: true,
        },
        isSysAdmin: {
            type: Boolean,
            required: false,
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        id: true,
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    });

userSchema.virtual('id').set(function (this: IUser & mongoose.Document, id: string) {
    this._id = id;
});

userSchema.virtual('name').get(function (this: IUser & mongoose.Document) {
    return `${this.firstName} ${this.lastName}`;
});

export const UserModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

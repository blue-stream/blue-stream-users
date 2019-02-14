import * as mongoose from 'mongoose';
import { IClassification } from './classification.interface';

const classificationSchema: mongoose.Schema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
        },
        user: {
            type: String,
            required: true,
        },
        layer: {
            type: Number,
            required: true,
            min: 0,
            max: 4,
        },
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: false,
            updatedAt: 'modificationDate',
        },
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    },
);

classificationSchema.index({ id: 1, user: 1 }, { unique: true });

export const ClassificationModel = mongoose.model<IClassification & mongoose.Document>('Classification', classificationSchema);

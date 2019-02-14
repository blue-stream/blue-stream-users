import { IClassification } from './classification.interface';
import { ClassificationModel } from './classification.model';

export class ClassificationRepository {
    static createClassifications(classifications: IClassification[]): Promise<IClassification[]> {
        return ClassificationModel.insertMany(classifications);
    }

    static getUserClassifications(userId: string): Promise<IClassification[]> {
        return ClassificationModel.find({ user: userId }).exec();
    }

    static removeUserClassifications(userId: string): Promise<void> {
        return ClassificationModel.remove({ user: userId }).exec();
    }
}

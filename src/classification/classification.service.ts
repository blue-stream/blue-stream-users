import { IClassification } from './classification.interface';
import { HttpClient } from '../utils/http.client';

interface UserPermissions {
    classificationsAllow: {
        classificationId: number,
        classificationLayer: 0 | 1 | 2 | 3 | 4,
    }[];
}

export class ClassificationService {
    static async fetchUserClassifications(userId: string): Promise<IClassification[] | undefined> {
        const result: UserPermissions = await HttpClient.get('/userPermissions', { userName: userId }).catch(e => undefined);
        return result ? result.classificationsAllow.map((classification) => {
            return {
                id: classification.classificationId,
                layer: classification.classificationLayer,
                user: userId,
            };
        }) : undefined;
    }
}

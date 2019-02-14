import { IClassification } from './classification.interface';
import { ClassificationRepository } from './classification.repository';
import { ClassificationService } from './classification.service';
import { config } from '../config';

export class ClassificationManager {
    static async getUserClassifications(userId: string): Promise<IClassification[]> {
        let classifications = await ClassificationRepository.getUserClassifications(userId);
        if (!classifications || classifications.length === 0 || ClassificationManager.hasExpiredClassification(classifications)) {
            classifications = await ClassificationManager.updateUserClassifications(userId);
        }

        return classifications || [];
    }

    /**
     * Check whether user has expired classifications
     * @see config.classification.expirationDays
     * @param classifications Array of user's classifications
     */
    static hasExpiredClassification(classifications: IClassification[]): boolean {
        const now = Date.now();
        const expiredClassification = classifications.find((classification) => {
            const timeDiff = Math.abs(classification.modificationDate!.getTime() - now);
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            return daysDiff > config.classifications.expirationDays;
        });

        return !!expiredClassification;
    }

    /**
     * Update user's classification from the external service
     * (remove all previous classifications and use only new)
     * @param userId
     * @returns Updated classifications
     */
    static async updateUserClassifications(userId: string): Promise<IClassification[]> {
        let classifications = await ClassificationService.fetchUserClassifications(userId);

        if (classifications) {
            await ClassificationRepository.removeUserClassifications(userId);
            classifications = await ClassificationRepository.createClassifications(classifications);
        }

        return classifications || [];
    }
}

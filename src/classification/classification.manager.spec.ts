import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ClassificationRepository } from './classification.repository';
import { ClassificationModel } from './classification.model';
import { ClassificationManager } from './classification.manager';
import { IClassification } from './classification.interface';
import { ClassificationsServiceMock } from './classification.service.mock';

const unknownUser = 'unknown@user';
const userWithNoClassifications = 'a@none';
const userWithClassifications = 'c@moreThenLittle';

describe('Classification Manager', function () {
    before(async function () {
        ClassificationsServiceMock.startMock();
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await ClassificationModel.deleteMany({}).exec();
    });

    after(async function () {
        ClassificationsServiceMock.stopMock();
        await mongoose.connection.close();
    });

    describe('#updateUserClassifications()', function () {
        it('Should return empty array when user is unknown (in remote service)', async function () {
            const classifications = await ClassificationManager.updateUserClassifications(unknownUser);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.be.empty;
        });

        it('Should return empty array when user don\'t have any classifications', async function () {
            const classifications = await ClassificationManager.updateUserClassifications(userWithNoClassifications);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.be.empty;
        });

        it('Should return array of user\'s classification and save it to db', async function () {
            const classifications = await ClassificationManager.updateUserClassifications(userWithClassifications);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.not.be.empty;

            const savedClassifications = await ClassificationRepository.getUserClassifications(userWithClassifications);

            expect(savedClassifications).to.exist;
            expect(savedClassifications).to.be.an('array');
            expect(savedClassifications).to.have.lengthOf(classifications.length);
            savedClassifications.forEach((classification) => {
                expect(classification).to.have.property('user', userWithClassifications);
                expect(classification).to.have.property('modificationDate');
            });
        });

        it('Should override all user\'s classification from db with newly fetched classifications', async function () {
            // tslint:disable-next-line:prefer-array-literal
            const classifications: IClassification[] = (new Array(100).fill(0)).map((_, index: number) => {
                return { id: index, user: userWithClassifications, layer: 2 as 0 | 1 | 2 | 3 | 4 };
            });

            const userClassifications = await ClassificationRepository.createClassifications(classifications);
            expect(userClassifications).to.exist;
            expect(userClassifications).to.have.lengthOf(classifications.length);

            const updatedClassifications = await ClassificationManager.updateUserClassifications(userWithClassifications);
            expect(updatedClassifications).to.have.length.lessThan(userClassifications.length);
        });
    });

    describe('#hasExpiredClassification()', function () {
        it('Should return true when there is an expired classification', function () {
            const classifications: IClassification[] = [
                { id: 1, user: 'a@a', layer: 1, modificationDate: new Date(Date.now() - (config.classifications.expirationDays * 24 * 60 * 60 * 1000 + 1)) },
                { id: 2, user: 'a@a', layer: 1, modificationDate: new Date() },
                { id: 3, user: 'a@a', layer: 1, modificationDate: new Date() },
            ];

            const result = ClassificationManager.hasExpiredClassification(classifications);
            expect(result).to.be.true;
        });

        it('Should return false when there is no expired classification', function () {
            const classifications: IClassification[] = [
                { id: 1, user: 'a@a', layer: 1, modificationDate: new Date() },
                { id: 2, user: 'a@a', layer: 1, modificationDate: new Date() },
                { id: 3, user: 'a@a', layer: 1, modificationDate: new Date() },
                { id: 4, user: 'a@a', layer: 1, modificationDate: new Date() },
            ];

            const result = ClassificationManager.hasExpiredClassification(classifications);
            expect(result).to.be.false;
        });

        it('Should return false when no classifications at all', function () {
            const result = ClassificationManager.hasExpiredClassification([]);
            expect(result).to.be.false;
        });
    });

    describe('#getUserClassifications()', function () {
        it('Should return empty array when user don\'t have any classifications', async function () {
            const classifications = await ClassificationManager.getUserClassifications(userWithNoClassifications);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.be.empty;
        });

        it('Should return empty array when user not exists in remote service', async function () {
            const classifications = await ClassificationManager.getUserClassifications(unknownUser);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.be.empty;
        });

        it('Should return user\'s classification and save it to db', async function () {
            const classifications = await ClassificationManager.getUserClassifications(userWithClassifications);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            expect(classifications).to.be.not.empty;

            const savedClassifications = await ClassificationRepository.getUserClassifications(userWithClassifications);
            expect(savedClassifications).to.exist;
            expect(savedClassifications).to.be.an('array');
            expect(savedClassifications).to.lengthOf(classifications.length);
        });

        it('Should update user\'s classifications when there is an expired classification', async function () {
            const expiredClassifications: IClassification[] = [
                { id: 1, user: userWithClassifications, layer: 1, modificationDate: new Date(Date.now() - (config.classifications.expirationDays * 24 * 60 * 60 * 1000 + 1)) },
                { id: 2, user: userWithClassifications, layer: 1, modificationDate: new Date() },
                { id: 3, user: userWithClassifications, layer: 1, modificationDate: new Date() },
            ];

            await ClassificationRepository.createClassifications(expiredClassifications);

            const timeBeforeUpdate = new Date();
            const classifications = await ClassificationManager.getUserClassifications(userWithClassifications);

            expect(classifications).to.exist;
            expect(classifications).to.be.an('array');
            classifications.forEach((classification) => {
                expect(classification).to.have.property('modificationDate').greaterThan(timeBeforeUpdate);
            });
        });
    });
});

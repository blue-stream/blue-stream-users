import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IUser } from './user.interface';
import { UserRepository } from './user.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';
const user: IUser = {
    property: 'prop',
};
const userArr: IUser[] = ['prop', 'prop', 'prop', 'b', 'c', 'd'].map(item => ({ property: item }));
const invalidUser: any = {
    property: { invalid: true },
};
const userFilter: Partial<IUser> = { property: 'prop' };
const userDataToUpdate: Partial<IUser> = { property: 'updated' };
const unexistingUser: Partial<IUser> = { property: 'unexisting' };
const unknownProperty: Object = { unknownProperty: true };

describe('User Repository', function () {
    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        context('When user is valid', function () {
            it('Should create user', async function () {
                const createdUser = await UserRepository.create(user);
                expect(createdUser).to.exist;
                expect(createdUser).to.have.property('property', 'prop');
                expect(createdUser).to.have.property('createdAt');
                expect(createdUser).to.have.property('updatedAt');
                expect(createdUser).to.have.property('_id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When user is invalid', function () {
            it('Should throw validation error when incorrect property type', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.create(invalidUser);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/cast.+failed/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('property');
                    expect(err.errors.property).to.have.property('name', 'CastError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when empty user passed', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.create({} as IUser);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown);
                }
            });
        });
    });

    describe('#createMany()', function () {
        context('When data is valid', function () {
            it('Should create many documents', async function () {
                const createdDocuments = await UserRepository.createMany(userArr);

                expect(createdDocuments).to.exist;
                expect(createdDocuments).to.be.an('array');
                expect(createdDocuments).to.have.lengthOf(userArr.length);
            });

            it('Should not create documents when empty array passed', async function () {
                const docs = await UserRepository.createMany([]);

                expect(docs).to.exist;
                expect(docs).to.be.an('array');
                expect(docs).to.be.empty;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when 1 of the docs invalid', async function () {
                let hasThrown = false;
                const docs: IUser[] = [
                    ...userArr,
                    {} as IUser,
                ];

                try {
                    await UserRepository.createMany(docs);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateById()', function () {

        let createdUser: IUser;

        beforeEach(async function () {
            createdUser = await UserRepository.create(user);
            expect(createdUser).have.property('id');
        });

        context('When data is valid', function () {

            it('Should update an existsing user', async function () {
                const updatedDoc = await UserRepository.updateById(createdUser.id!, userDataToUpdate);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdUser.id);
                for (const prop in userDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, userDataToUpdate[prop as keyof IUser]);
                }
            });

            it('Should not update an existing user when empty data provided', async function () {
                const updatedDoc = await UserRepository.updateById(createdUser.id!, {});
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdUser.id);

                for (const prop in user) {
                    expect(updatedDoc).to.have.property(prop, createdUser[prop as keyof IUser]);
                }
            });

            it('Should return null when updated doc does does not exist', async function () {
                const updatedDoc = await UserRepository.updateById(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.updateById(createdUser.id as string, { property: null } as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateMany()', function () {

        beforeEach(async function () {
            await UserRepository.createMany(userArr);
        });

        context('When data is valid', function () {

            it('Should update many documents', async function () {
                const updated = await UserRepository.updateMany(userFilter, userDataToUpdate);

                const amountOfRequiredUpdates = userArr.filter((item: IUser) => {
                    let match = true;
                    for (const prop in userFilter) {
                        match = match && item[prop as keyof IUser] === userFilter[prop as keyof IUser];
                    }

                    return match;
                }).length;

                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', amountOfRequiredUpdates);

                const documents = await UserRepository.getMany(userDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(amountOfRequiredUpdates);
            });

            it('Should update all documents when no filter passed', async function () {
                const updated = await UserRepository.updateMany({}, userDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', userArr.length);

                const documents = await UserRepository.getMany(userDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(userArr.length);
            });

            it('Should do nothing when criteria does not match any document', async function () {
                const updated = await UserRepository.updateMany(unexistingUser, userDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', 0);

                const documents = await UserRepository.getMany(userDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });

        });

        context('When data is invalid', function () {

            it('Should throw error when empty data provided', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.updateMany(userFilter, {});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should not update documents when invalid data passed', async function () {
                await UserRepository.updateMany({}, unknownProperty);

                const documents = await UserRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.satisfy((documents: IUser[]) => {
                    documents.forEach((doc: IUser) => {
                        for (const prop in unknownProperty) {
                            expect(doc).to.not.have.property(prop);
                        }
                    });

                    return true;
                });
            });
        });
    });

    describe('#deleteById()', function () {

        let document: IUser;

        beforeEach(async function () {
            document = await UserRepository.create(user);
        });

        context('When data is valid', function () {

            it('Should delete document by id', async function () {
                const deleted = await UserRepository.deleteById(document.id!);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('id', document.id);

                const doc = await UserRepository.getById(document.id!);
                expect(doc).to.not.exist;
            });

            it('Should return null when document does not exist', async function () {
                const deleted = await UserRepository.deleteById(new mongoose.Types.ObjectId().toHexString());
                expect(deleted).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in the correct format', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.deleteById('invalid id');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'CastError');
                    expect(err).to.have.property('kind', 'ObjectId');
                    expect(err).to.have.property('path', '_id');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getById()', function () {

        context('When data is valid', function () {

            let document: IUser;
            beforeEach(async function () {
                document = await UserRepository.create(user);
            });

            it('Should return document by id', async function () {
                const doc = await UserRepository.getById(document.id!);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in user) {
                    expect(doc).to.have.property(prop, user[prop as keyof IUser]);
                }
            });

            it('Should return null when document does not exist', async function () {
                const doc = await UserRepository.getById(validId);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.getById(invalidId);
                } catch (err) {
                    hasThrown = true;

                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getOne()', function () {

        context('When data is valid', function () {
            let document: IUser;

            beforeEach(async function () {
                document = await UserRepository.create(user);
            });

            it('Should return document by id', async function () {
                const doc = await UserRepository.getOne({ _id: document.id } as Partial<IUser>);
                expect(doc).to.exist;
                for (const prop in user) {
                    expect(doc).to.have.property(prop, user[prop as keyof IUser]);
                }
            });

            it('Should return document by property', async function () {
                const doc = await UserRepository.getOne(userFilter);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in user) {
                    expect(doc).to.have.property(prop, user[prop as keyof IUser]);
                }
            });

            it('Should return null when document does not exist', async function () {
                const doc = await UserRepository.getOne(unexistingUser);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter does not exist', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.getOne({});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in the correct format', async function () {
                const doc = await UserRepository.getOne(unknownProperty);
                expect(doc).to.not.exist;
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await UserRepository.createMany(userArr);
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await UserRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(userArr.length);
            });

            it('Should return only matching documents', async function () {
                const documents = await UserRepository.getMany(userFilter);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');

                const amountOfRequiredDocuments = userArr.filter((item: IUser) => {
                    let match = true;
                    for (const prop in userFilter) {
                        match = match && item[prop as keyof IUser] === userFilter[prop as keyof IUser];
                    }

                    return match;
                }).length;

                expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await UserRepository.getMany(unexistingUser);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await UserRepository.getMany(0 as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return empty array when filter is not in correct format', async function () {
                const documents = await UserRepository.getMany(unknownProperty);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await UserRepository.createMany(userArr);
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await UserRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(userArr.length);
            });

            it('Should return amount of filtered documents', async function () {
                const amount = await UserRepository.getAmount(userFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');

                const amountOfRequiredDocuments = userArr.filter((item: IUser) => {
                    let match = true;
                    for (const prop in userFilter) {
                        match = match && item[prop as keyof IUser] === userFilter[prop as keyof IUser];
                    }

                    return match;
                }).length;

                expect(amount).to.equal(amountOfRequiredDocuments);
            });

            it('Should return 0 when no documents matching filter', async function () {
                const amount = await UserRepository.getAmount(unexistingUser);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });

        context('When data is invalid', function () {
            it('Should return 0 when filter is not in the correct format', async function () {
                const amount = await UserRepository.getAmount(unknownProperty);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });
    });
});
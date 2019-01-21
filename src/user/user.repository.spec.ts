import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IUser } from './user.interface';
import { UserRepository } from './user.repository';
import { UserValidations } from './validator/user.validations';

const validId: string = 'T234@245';
const invalidId: string = 'ADSS234.ssd@df';
const invalidFirstname: string = 'a';
const invalidLastname: string = 'a'.repeat(config.validator.user.lastname.maxLength + 1);
const invalidMail: string = 'Tasfd.sadf';

const user: IUser = {
    id: validId,
    firstName: 'firstnameone',
    lastName: 'lastnameone',
    mail: 'T234245asa@asd.sdf',
};

const sameUserNames: IUser = {
    id: 'ADSFD@sss',
    firstName: 'firstnameone',
    lastName: 'lastnameone',
    mail: 'ADSFD@sss.sdf',
};

const user2: IUser = {
    id: 'T2AS34@245',
    firstName: 'firstnametwo',
    lastName: 'lastnametwo',
    mail: 'T234245@asd.aaa',
};

const user3: IUser = {
    id: 'Tasas323@9000',
    firstName: 'firstnameone',
    lastName: 'lastnamethree',
    mail: 'T234245asa@asd.sdf',
};

const invalidUser: IUser = {
    id: invalidId,
    firstName: invalidFirstname,
    lastName: invalidLastname,
    mail: invalidMail,
};

const userFilter: Partial<IUser> = { firstName: 'firstnameone', lastName: 'lastnameone' };
const userDataToUpdate: Partial<IUser> = { firstName: 'updateFirstname' };
const unexistingUser: Partial<IUser> = { id: 'aa@aa' };
const unexistingUserFilter: Partial<IUser> = { firstName: 'firstnameone', lastName: 'nonExistingLastname' };
const unknownProperty: Object = { unknownProperty: true };

const userArr: IUser[] = [user, user2, user3];

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
                expect(createdUser).to.have.property('createdAt');
                expect(createdUser).to.have.property('updatedAt');

                for (const prop in user) {
                    expectToHaveEqualProperty(createdUser, prop, user[prop as keyof IUser]);
                }

                expect(createdUser).to.have.property('id').which.satisfies((id: any) => {
                    return UserValidations.isIdValid(id);
                });
            });
        });

        context('When user is invalid', function () {
            for (const prop in invalidUser) {
                it(`Should throw validation error when incorrect ${prop} entered`, async function () {
                    let hasThrown = false;

                    const invalidOnePropUser = {
                        ...user,
                    };

                    invalidOnePropUser[prop as keyof IUser] = invalidUser[prop as keyof IUser];

                    try {
                        await UserRepository.create(invalidOnePropUser);
                    } catch (err) {
                        hasThrown = true;
                        expect(err).to.exist;
                        expect(err).to.have.property('name', 'ValidationError');
                        expect(err).to.have.property('errors');
                        if (prop === 'id') {
                            expect(err.errors).to.have.property('_id');
                        } else {
                            expect(err.errors).to.have.property(prop);
                        }
                    } finally {
                        expect(hasThrown).to.be.true;
                    }
                });
            }

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

    describe('#updateById()', function () {

        let createdUser: IUser;

        beforeEach(async function () {
            createdUser = await UserRepository.create(user);
            expect(createdUser).have.property('_id');
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
                const updatedDoc = await UserRepository.updateById('NonExistingId', {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            const invalidUserProps: Partial<IUser> = { ...invalidUser };
            delete invalidUserProps.id;

            for (const prop in invalidUserProps) {
                it(`Should throw validation error when ${prop} is not valid`, async function () {
                    let hasThrown = false;

                    try {
                        await UserRepository.updateById(createdUser.id as string, { [prop]: invalidUserProps[prop as keyof IUser] } as any);
                    } catch (err) {
                        hasThrown = true;
                        expect(err).to.exist;
                        expect(err).to.have.property('name', 'ValidationError');
                        expect(err).to.have.property('errors');
                        expect(err.errors).to.have.property(prop);
                    } finally {
                        expect(hasThrown).to.be.true;
                    }
                });
            }
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
                const doc = await UserRepository.getById(unexistingUser.id!);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                const user = await UserRepository.getById(invalidId);

                expect(user).to.not.exist;
                expect(user).to.be.null;
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(function () {
                return Promise.all(userArr.map(user => UserRepository.create(user)));
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await UserRepository.getMany({}, 0, 10);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(userArr.length);
            });

            it('Should return only matching documents by 2 properties', async function () {
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

            const validUserWithoutId: Partial<IUser> = { ...user };
            delete validUserWithoutId.id;

            for (const prop in validUserWithoutId) {
                it(`Should return only matching documents by ${prop}`, async function () {
                    const documents = await UserRepository.getMany({ [prop]: user[prop as keyof IUser] }, 0, 10);
                    expect(documents).to.exist;
                    expect(documents).to.be.an('array');

                    const amountOfRequiredDocuments = userArr.filter((item: IUser) => {
                        return item[prop as keyof IUser] === user[prop as keyof IUser];
                    }).length;

                    expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
                });
            }

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await UserRepository.getMany(unexistingUserFilter, 0, 10);
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
                const documents = await UserRepository.getMany(unknownProperty, 0, 10);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(function () {
                return Promise.all(userArr.map(user => UserRepository.create(user)));
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

            it('Should return 2 for matching 2 users by 2 properties', async function () {
                await UserRepository.create(sameUserNames);
                const amount = await UserRepository.getAmount(userFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(2);
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

function expectToHaveEqualProperty(source: Object, prop: string, value: any) {
    if (typeof value === 'object') {
        expect(source).to.have.property(prop).deep.equal(value);
    } else {
        expect(source).to.have.property(prop, value);
    }
}

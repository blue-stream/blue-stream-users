import * as request from 'supertest';
import { expect } from 'chai';

import * as mongoose from 'mongoose';
import { IUser } from './user.interface';
import { Server } from '../server';
import { IdInvalidError, UserNotFoundError } from '../utils/errors/userErrors';
import { config } from '../config';
import { UserManager } from './user.manager';
import { sign } from 'jsonwebtoken';

describe('User Router Module', function () {
    let server: Server;
    const validId: string = 'T234@245';
    const invalidId: string = 'TDAS234';

    const user: IUser = {
        _id: validId,
        firstName: 'firstnameone',
        lastName: 'lastnameone',
        mail: 'T234245asa@asd.sdf',
    };

    const updatedUser: Partial<IUser> = {
        firstName: 'updateFirstname',
        lastName: 'updatelastname',
        mail: 'AA@asd.sdf',
    };

    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    const invalidIdUser: IUser = {
        _id: invalidId,
        firstName: 'a'.repeat(config.validator.user.firstname.maxLength + 1),
        lastName: 'a'.repeat(config.validator.user.lastname.minLength - 1),
        mail: 'T2asf5assaasd.sdf',
    };

    // const users: IUser[] =
    //     [user, user2, user3, user3];

    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
    });

    describe('#POST /api/user/', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return created user', function (done: MochaDone) {
                request(server.app)
                    .post('/api/user/')
                    .send(user)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id', user._id);
                        expect(res.body).to.have.property('firstName', user.firstName);
                        expect(res.body).to.have.property('lastName', user.lastName);
                        expect(res.body).to.have.property('mail', user.mail);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/user/')
                    .send(invalidIdUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            // firstname too long
            // firstname too short
            // lastname too long
            // lastname too short
            // mail is invalid
            // duplicate mail (not unique)
        });
    });

    describe('#PUT /api/user/:id', function () {
        let returnedUser: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedUser = await UserManager.create(user);
            });

            it('Should return updated user', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(updatedUser)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id', user._id);
                        expect(res.body).to.have.property('firstName', updatedUser.firstName);
                        expect(res.body).to.have.property('lastName', updatedUser.lastName);
                        expect(res.body).to.have.property('mail', updatedUser.mail);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/user/${new mongoose.Types.ObjectId()}`)
                    .send(user)
                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', UserNotFoundError.name);
                        expect(res.body).to.have.property('message', new UserNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedUser = await UserManager.create(user);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/user/2')
                    .send(user)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(invalidUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    // describe('#GET /api/user/many', function () {
    //     let returnedUsers: any;

    //     context('When request is valid', function () {
    //         beforeEach(async function () {
    //             await mongoose.connection.db.dropDatabase();
    //             returnedUsers = await UserManager.createMany(users);
    //         });

    //         it('Should return user', function (done: MochaDone) {
    //             request(server.app)
    //                 .get(`/api/user/many?property=${user3.property}`)
    //                 .set({ authorization: authorizationHeader })
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((error: Error, res: request.Response) => {
    //                     expect(error).to.not.exist;
    //                     expect(res).to.exist;
    //                     expect(res.status).to.equal(200);
    //                     expect(res).to.have.property('body');
    //                     expect(res.body).to.be.an('array');
    //                     expect(res.body[1]).to.have.property('property', users[2].property);

    //                     done();
    //                 });
    //         });
    //     });
    // });

    // describe('#GET /api/user/amount', function () {
    //     let returnedUsers: any;

    //     context('When request is valid', function () {
    //         beforeEach(async function () {
    //             await mongoose.connection.db.dropDatabase();
    //             returnedUsers = await UserManager.createMany(users);
    //         });

    //         it('Should return user', function (done: MochaDone) {
    //             request(server.app)
    //                 .get(`/api/user/amount?property=${user3.property}`)
    //                 .set({ authorization: authorizationHeader })
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((error: Error, res: request.Response) => {
    //                     expect(error).to.not.exist;
    //                     expect(res).to.exist;
    //                     expect(res.status).to.equal(200);
    //                     expect(res).to.have.property('body');
    //                     expect(res.body).be.equal(2);

    //                     done();
    //                 });
    //         });
    //     });
    // });

    // describe('#GET /api/user/:id', function () {
    //     let returnedUser: any;

    //     context('When request is valid', function () {
    //         beforeEach(async function () {
    //             await mongoose.connection.db.dropDatabase();
    //             returnedUser = await UserManager.create(user);
    //         });

    //         it('Should return user', function (done: MochaDone) {
    //             request(server.app)
    //                 .get(`/api/user/${returnedUser.id}`)
    //                 .set({ authorization: authorizationHeader })
    //                 .expect(200)
    //                 .expect('Content-Type', /json/)
    //                 .end((error: Error, res: request.Response) => {
    //                     expect(error).to.not.exist;
    //                     expect(res).to.exist;
    //                     expect(res.status).to.equal(200);
    //                     expect(res).to.have.property('body');
    //                     expect(res.body).to.be.an('object');
    //                     expect(res.body).to.have.property('property', user.property);

    //                     done();
    //                 });
    //         });

    //         it('Should return error when user not found', function (done: MochaDone) {
    //             request(server.app)
    //                 .get(`/api/user/${new mongoose.Types.ObjectId()}`)
    //                 .set({ authorization: authorizationHeader })
    //                 .expect(404)
    //                 .expect('Content-Type', /json/)
    //                 .end((error: Error, res: request.Response) => {
    //                     expect(res).to.exist;
    //                     expect(res.status).to.equal(404);
    //                     expect(res).to.have.property('body');
    //                     expect(res.body).to.be.an('object');
    //                     expect(res.body).to.have.property('type', UserNotFoundError.name);
    //                     expect(res.body).to.have.property('message', new UserNotFoundError().message);

    //                     done();
    //                 });
    //         });
    //     });

    //     context('When request is invalid', function () {
    //         beforeEach(async function () {
    //             await mongoose.connection.db.dropDatabase();
    //             returnedUser = await UserManager.create(user);
    //         });

    //         it('Should return error status when id is invalid', function (done: MochaDone) {
    //             request(server.app)
    //                 .get(`/api/user/${invalidId}`)
    //                 .set({ authorization: authorizationHeader })
    //                 .expect(400)
    //                 .expect('Content-Type', /json/)
    //                 .end((error: Error, res: request.Response) => {
    //                     expect(error).to.not.exist;
    //                     expect(res.status).to.equal(400);
    //                     expect(res).to.have.property('body');
    //                     expect(res.body).to.be.an('object');
    //                     expect(res.body).to.have.property('type', IdInvalidError.name);
    //                     expect(res.body).to.have.property('message', new IdInvalidError().message);

    //                     done();
    //                 });
    //         });
    //     });
    // });
});

import * as request from 'supertest';
import { expect } from 'chai';

import * as mongoose from 'mongoose';
import { UserRepository } from './user.repository';
import { IUser } from './user.interface';
import { Server } from '../server';
import { IdInvalidError, UserNotFoundError, NameInvalidError, MailInvalidError } from '../utils/errors/userErrors';
import { config } from '../config';
import { UserManager } from './user.manager';
import { sign } from 'jsonwebtoken';

describe('User Router Module', function () {
    let server: Server;
    const validId: string = 'T234@245';
    const invalidId: string = 'TDAS234';
    const invalidShortFirstname = 'a'.repeat(config.validator.user.firstname.minLength - 1);
    const invalidLongFirstname = 'a'.repeat(config.validator.user.firstname.maxLength + 1);
    const invalidShortLastname = 'b'.repeat(config.validator.user.firstname.minLength - 1);
    const invalidLongLastname = 'b'.repeat(config.validator.user.firstname.maxLength + 1);
    const invalidMail = 'T2asf5assaasd.sdf';

    const user: IUser = {
        id: validId,
        firstName: 'firstnameone',
        lastName: 'lastnameone',
        mail: 'T234245asa@asd.sdf',
    };

    const user2: IUser = {
        id: 'asd@nnn',
        firstName: 'firstnametwo',
        lastName: 'lastnametwo',
        mail: 'T245as@asd.sdf',
    };

    const user3: IUser = {
        id: 'asdasd@fff',
        firstName: 'firstnameone',
        lastName: 'lastnamethree',
        mail: 'T234245@asd.sdf',
    };

    const updatedUser: Partial<IUser> = {
        firstName: 'newFirstname',
        lastName: 'newLastname',
        mail: 'AA@asd.sdf',
    };

    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    const invalidIdUser: IUser = {
        id: invalidId,
        firstName: invalidLongFirstname,
        lastName: invalidShortLastname,
        mail: invalidMail,
    };

    const users: IUser[] = [user, user2, user3];

    before(async function () {
        await mongoose.connect(config.db.connectionString, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
    });

    describe.skip('#POST /api/user/', function () {
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
                        expect(res.body).to.have.property('id', user.id);
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

            it('Should return IdInvalidError when id is invalid', function (done: MochaDone) {
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

            it('Should return NameInvalidError when firstName too short', function (done: MochaDone) {
                const invalidFirstnameUser = { ...user };
                invalidFirstnameUser.firstName = invalidShortFirstname;
                request(server.app)
                    .post('/api/user/')
                    .send(invalidFirstnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);
                        expect(res.body).to.have.property('message', new NameInvalidError().message);

                        done();
                    });
            });

            it('Should return NameInvalidError when firstName too long', function (done: MochaDone) {
                const invalidFirstnameUser = { ...user };
                invalidFirstnameUser.firstName = invalidLongFirstname;
                request(server.app)
                    .post('/api/user/')
                    .send(invalidFirstnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);
                        expect(res.body).to.have.property('message', new NameInvalidError().message);

                        done();
                    });
            });

            it('Should return NameInvalidError when lastName too short', function (done: MochaDone) {
                const invalidLastnameUser = { ...user };
                invalidLastnameUser.lastName = invalidShortLastname;
                request(server.app)
                    .post('/api/user/')
                    .send(invalidLastnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);
                        expect(res.body).to.have.property('message', new NameInvalidError().message);

                        done();
                    });
            });

            it('Should return NameInvalidError when lastName too long', function (done: MochaDone) {
                const invalidLastnameUser = { ...user };
                invalidLastnameUser.lastName = invalidLongLastname;
                request(server.app)
                    .post('/api/user/')
                    .send(invalidLastnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);
                        expect(res.body).to.have.property('message', new NameInvalidError().message);

                        done();
                    });
            });

            it('Should return MailInvalidError when mail is invalid', function (done: MochaDone) {
                const invalidMailUser = { ...user };
                invalidMailUser.mail = invalidMail;
                request(server.app)
                    .post('/api/user/')
                    .send(invalidMailUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', MailInvalidError.name);
                        expect(res.body).to.have.property('message', new MailInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe.skip('#PUT /api/user/:id', function () {
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
                        expect(res.body).to.have.property('id', user.id);
                        expect(res.body).to.have.property('firstName', updatedUser.firstName);
                        expect(res.body).to.have.property('lastName', updatedUser.lastName);
                        expect(res.body).to.have.property('mail', updatedUser.mail);

                        done();
                    });
            });

            it('Should return UserNotFoundError when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put('/api/user/aa@aa')
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

            it('Should return IdInvalidError when id is invalid', function (done: MochaDone) {
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

            it('Should return NameInvalidError when firstname is too long', function (done: MochaDone) {
                const invalidFirstnameUser = { ...user };
                invalidFirstnameUser.firstName = invalidLongFirstname;
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(invalidFirstnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);

                        done();
                    });
            });

            it('Should return error status when firstname is too short', function (done: MochaDone) {
                const invalidFirstnameUser = { ...user };
                invalidFirstnameUser.firstName = invalidShortFirstname;
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(invalidFirstnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);

                        done();
                    });
            });

            it('Should return error status when lastname is too long', function (done: MochaDone) {
                const invalidLastnameUser = { ...user };
                invalidLastnameUser.lastName = invalidLongLastname;
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(invalidLastnameUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);

                        done();
                    });
            });

            it('Should return MailInvalidError when mail is invalid', function (done: MochaDone) {
                const invalidMailUser = { ...user };
                invalidMailUser.mail = invalidMail;
                request(server.app)
                    .put(`/api/user/${returnedUser.id}`)
                    .send(invalidMailUser)
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', MailInvalidError.name);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/user/:id', function () {
        let returnedUser: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedUser = await UserManager.create(user);
            });

            it('Should return user', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/user/${returnedUser.id}`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id', user.id);
                        expect(res.body).to.have.property('firstName', user.firstName);
                        expect(res.body).to.have.property('lastName', user.lastName);
                        expect(res.body).to.have.property('mail', user.mail);

                        done();
                    });
            });

            it('Should return UserNotFoundError when user not found', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/aa@aa')
                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
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
                    .get(`/api/user/${invalidId}`)
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
        });
    });

    describe('#GET /api/user/many', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                return Promise.all(users.map(user => UserManager.create(user)));
            });

            it('Should return users matching the filter', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/user/many?firstName=${user.firstName}`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[0]).to.exist;
                        expect(res.body[0]).to.have.property('firstName');
                        expect(res.body[0].firstName).to.be.equal(user.firstName);
                        expect(res.body[1]).to.exist;
                        expect(res.body[1]).to.have.property('firstName');
                        expect(res.body[1].firstName).to.be.equal(user.firstName);

                        done();
                    });
            });

            it('Should return empty array for non matching the filter', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/many?firstName=unexistingFirstname')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array').empty;

                        done();
                    });
            });
        });
    });

    describe('#GET /api/user/amount', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                return Promise.all(users.map(user => UserManager.create(user)));
            });

            it('Should return number of found users by firstName property', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/user/amount?firstName=${user.firstName}`)
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(2);

                        done();
                    });
            });

            it('Should return 0 for non found users', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/amount?id=aa@aa')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(0);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/user/search', function () {

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                return Promise.all(users.map(user => UserManager.create(user)));
            });

            it('Should return all videos when searchFilter is empty', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/search?searchFilter=')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        const returnedUsers: IUser[] = res.body;
                        expect(returnedUsers.length).to.be.equals(users.length);

                        returnedUsers.forEach(function (usr) {
                            for (const prop in user) {
                                expect(usr).to.have.property(prop);
                            }
                        });

                        done();
                    });
            });

            it('Should return users filitered by id / firstName / lastName / mail', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/search?searchFilter=t')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');

                        const returnedUsers: IUser[] = res.body;
                        const expectedResults = users.filter((usr: IUser) => {
                            return (
                                usr.id.includes('t') ||
                                usr.firstName.includes('t') ||
                                usr.lastName.includes('t') ||
                                usr.mail.includes('t')
                            );
                        }).length;

                        expect(returnedUsers).to.have.length(expectedResults);

                        returnedUsers.forEach(function (usr) {
                            for (const prop in user) {
                                expect(usr).to.have.property(prop);
                            }
                        });

                        done();
                    });
            });
        });
    });

    describe('#GET /api/user/search/amount', function () {

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                return Promise.all(users.map(user => UserManager.create(user)));
            });

            it('Should return all videos when searchFilter is empty', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/search/amount?searchFilter=')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.a('number');
                        expect(res.body).to.be.equals(users.length);

                        done();
                    });
            });

            it('Should return users filitered by id / firstName / lastName / mail', function (done: MochaDone) {
                request(server.app)
                    .get('/api/user/search/amount?searchFilter=t')
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.a('number');

                        const expectedResults = users.filter((usr: IUser) => {
                            return (
                                usr.id.includes('t') ||
                                usr.firstName.includes('t') ||
                                usr.lastName.includes('t') ||
                                usr.mail.includes('t')
                            );
                        }).length;

                        expect(res.body).to.be.equals(expectedResults);
                        done();
                    });
            });
        });
    });
});

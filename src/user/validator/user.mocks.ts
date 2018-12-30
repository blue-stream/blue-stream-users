import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';
import { IUser } from '../user.interface';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validId: string = 't012';
    readonly validMail: string = 't012@aaa';
    readonly validId2: string = 'T2_34';
    readonly validMail2: string = 'T2_34@abc.abc.iif';
    readonly validId3: string = 'AG234';
    readonly validMail3: string = 'AG234@abc.abc';

    readonly user: IUser = {
        _id: this.validId,
        firstName: 'firstname1',
        lastName: 'lastname1',
        mail: this.validMail,
    };

    readonly user2: IUser = {
        _id: this.validId2,
        firstName: 'firstname2',
        lastName: 'lastname2',
        mail: this.validMail2,
    };

    readonly user3: IUser = {
        _id: this.validId3,
        firstName: 'firstname3',
        lastName: 'lastname3',
        mail: this.validMail3,
    };

    readonly userFilter = this.user;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/user/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.user,
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: this.validId,
        },
        body: this.user,
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: this.validId,
        },
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: this.validId,
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: '/api/user/one',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });

    getMany = createRequest({
        method: 'GET',
        url: '/api/user/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });

    getAmount = createRequest({
        method: 'GET',
        url: '/api/user/amount',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });
}


import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validProperty: string = '12345';
    readonly validProperty2: string = '23456';
    readonly validProperty3: string = '34567';

    readonly user = {
        property: this.validProperty,
    };

    readonly user2 = {
        property: this.validProperty2,
    };

    readonly user3 = {
        property: this.validProperty3,
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

    createMany = createRequest({
        method: 'POST',
        url: '/api/user/many/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: [
            this.user,
            this.user2,
            this.user3,
        ],
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
            id_REMOVE: '12345',
        },
        body: this.user,
    });

    updateMany = createRequest({
        method: 'PUT',
        url: '/api/user/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.userFilter,
        body: this.user,
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/user/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: `/api/user/one?userFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/user/many?userFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/user/amount?userFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.user,
    });
}

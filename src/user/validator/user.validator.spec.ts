import { expect } from 'chai';
import { UserValidator } from './user.validator';
import { ValidRequestMocks, responseMock } from './user.mocks';
import { IdInvalidError, MailInvalidError, NameInvalidError } from '../../utils/errors/userErrors';

describe('User Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When Id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.property = undefined;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When Id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.property = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When Id is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body._id = 'T324A32.d';

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.firstName = undefined;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.firstName = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.firstName = 'a';

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body._id = 'a'.repeat(20);

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = undefined;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = 'a';

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = 'a'.repeat(20);

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.mail = undefined;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });


        });
    });

    describe('UpdateById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canUpdateById(new ValidRequestMocks().updateById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = undefined;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = null;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = '2142142142141241';

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = undefined;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = null;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = '1244';

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canDeleteById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canDeleteById(new ValidRequestMocks().deleteById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                UserValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                UserValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = '1243';

                UserValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canGetById(new ValidRequestMocks().getById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = undefined;

                UserValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = null;

                UserValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = '1234';

                UserValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canGetOne(new ValidRequestMocks().getOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetAmount Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });
});

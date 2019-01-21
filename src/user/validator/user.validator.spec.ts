import { expect } from 'chai';
import { UserValidator } from './user.validator';
import { config } from '../../config';
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
                invalidRequestMock.body.id = undefined;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When Id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.id = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When Id is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.id = 'T324A32.d';

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
                invalidRequestMock.body.firstName = 'a'.repeat(config.validator.user.firstname.minLength - 1);

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.firstName = 'a'.repeat(config.validator.user.firstname.maxLength + 1);

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
                invalidRequestMock.body.lastName = 'a'.repeat(config.validator.user.lastname.minLength - 1);

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.lastName = 'a'.repeat(config.validator.user.lastname.maxLength + 1);

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
                    expect(error).to.be.an.instanceof(MailInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.mail = null;

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(MailInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is indalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.mail = 'Tasadas234';

                UserValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(MailInvalidError);
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
            it('Should throw an NameInvalidError When firstname is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.firstName = undefined;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.firstName = null;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.firstName = 'a'.repeat(config.validator.user.firstname.maxLength + 1);

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When firstname is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.firstName = 'a'.repeat(config.validator.user.firstname.minLength - 1);

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.lastName = undefined;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.lastName = null;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.lastName = 'a'.repeat(config.validator.user.lastname.maxLength + 1);

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When lastname is too short', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.lastName = 'a'.repeat(config.validator.user.lastname.minLength - 1);

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.mail = undefined;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(MailInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.mail = null;

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(MailInvalidError);
                });
            });

            it('Should throw an MailInvalidError When mail is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.mail = 'Tasdas334';

                UserValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(MailInvalidError);
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

            it('Should throw an IdInvalidError When id is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = 'Tasd342.432';

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
                invalidRequestMock.params.id = null;

                UserValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = 'T342sdf.asd';

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

            it('Should throw an IdInvalidError When id is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = 'ASEk.jsd983@as';

                UserValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
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

import { Router } from 'express';
import { UserValidator } from './validator/user.validator';
import { UserController } from './user.contoller';
import { Wrapper } from '../utils/wrapper';

const UserRouter: Router = Router();

// UserRouter.post('/', UserValidator.canCreate, Wrapper.wrapAsync(UserController.create));

// UserRouter.put('/:id', UserValidator.canUpdateById, Wrapper.wrapAsync(UserController.updateById));

UserRouter.get('/many', UserValidator.canGetMany, Wrapper.wrapAsync(UserController.getMany));
UserRouter.get('/amount', UserValidator.canGetAmount, Wrapper.wrapAsync(UserController.getAmount));
UserRouter.get('/search', UserValidator.canGetSearched, Wrapper.wrapAsync(UserController.getSearched));
UserRouter.get('/search/amount', UserValidator.canGetSearchedAmount, Wrapper.wrapAsync(UserController.getSearchedAmount));

UserRouter.get('/:id', UserValidator.canGetById, Wrapper.wrapAsync(UserController.getById));

export { UserRouter };

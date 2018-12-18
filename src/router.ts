import { Router } from 'express';
import { UserRouter } from './user/user.router';

const AppRouter: Router = Router();

AppRouter.use('/api/user', UserRouter);

export { AppRouter };

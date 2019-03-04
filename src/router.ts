import { Router } from 'express';
import { UserRouter } from './user/user.router';
import { HealthRouter } from './health/health.router';

const AppRouter: Router = Router();

AppRouter.use('/api/user', UserRouter);
AppRouter.use('/health', HealthRouter);

export { AppRouter };

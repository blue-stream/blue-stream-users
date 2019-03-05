import { Router } from 'express';
import { Wrapper } from '../wrapper';
import { HealthController } from './health.controller';

const HealthRouter: Router = Router();

HealthRouter.get('/', Wrapper.wrapAsync(HealthController.healthCheck));

export { HealthRouter };

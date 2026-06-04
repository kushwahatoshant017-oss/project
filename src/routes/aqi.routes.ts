import { Router } from 'express';
import { validate } from '@middleware/validate';
import { weatherQuerySchema } from '@validators/weather';
import { getCurrentAQI } from '@controllers/aqi.controller';
import { authenticate } from '@middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/current', validate(weatherQuerySchema, 'query'), getCurrentAQI);

export default router;

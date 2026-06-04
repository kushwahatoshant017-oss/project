import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import { createAlertSchema } from '@validators/alerts';
import { createAlert, getAlerts, deleteAlert } from '@controllers/alert.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createAlertSchema), createAlert);
router.get('/', getAlerts);
router.delete('/:id', deleteAlert);

export default router;

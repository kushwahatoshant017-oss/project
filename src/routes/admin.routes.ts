import { Router } from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { getUsers, getStats } from '@controllers/admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/users', getUsers);
router.get('/stats', getStats);

export default router;

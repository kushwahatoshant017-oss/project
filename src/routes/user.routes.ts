import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import { updateProfileSchema } from '@validators/user';
import { getProfile, updateProfile } from '@controllers/user.controller';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);

export default router;

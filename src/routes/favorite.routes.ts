import { Router } from 'express';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import { createFavoriteSchema } from '@validators/favorites';
import { createFavorite, getFavorites, deleteFavorite } from '@controllers/favorite.controller';

const router = Router();

router.use(authenticate);

router.post('/', validate(createFavoriteSchema), createFavorite);
router.get('/', getFavorites);
router.delete('/:id', deleteFavorite);

export default router;

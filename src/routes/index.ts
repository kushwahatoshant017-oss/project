import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import weatherRoutes from './weather.routes';
import aqiRoutes from './aqi.routes';
import favoriteRoutes from './favorite.routes';
import alertRoutes from './alert.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/weather', weatherRoutes);
router.use('/aqi', aqiRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/alerts', alertRoutes);
router.use('/admin', adminRoutes);

export default router;

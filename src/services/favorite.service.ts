import { favoriteRepository } from '@repositories/favorite.repository';
import { ApiError } from '@utils/apiError';

export class FavoriteService {
  async create(userId: string, data: { latitude: number; longitude: number; locationName?: string; label?: string }) {
    const existing = await favoriteRepository.findByCoordinates(userId, data.latitude, data.longitude);
    if (existing) {
      throw ApiError.conflict('Location already in favorites');
    }

    const existingInactive = await favoriteRepository.findInactiveByCoordinates(userId, data.latitude, data.longitude);
    if (existingInactive) {
      return favoriteRepository.reactivate(existingInactive.id, {
        locationName: data.locationName || existingInactive.locationName || '',
        label: data.label ?? existingInactive.label ?? undefined,
      });
    }

    return favoriteRepository.create({
      userId,
      latitude: data.latitude,
      longitude: data.longitude,
      locationName: data.locationName || '',
      label: data.label,
    } as any);
  }

  async findAll(userId: string) {
    return favoriteRepository.findByUser(userId);
  }

  async delete(id: string, userId: string) {
    const favorite = await favoriteRepository.findByIdAndUser(id, userId);
    if (!favorite) {
      throw ApiError.notFound('Favorite location not found');
    }

    return favoriteRepository.softDelete(id);
  }
}

export const favoriteService = new FavoriteService();

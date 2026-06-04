import { notificationRepository } from '@repositories/notification.repository';
import { NotificationPayload } from '@types/index';

class NotificationService {
  async send(payload: NotificationPayload) {
    const notification = await notificationRepository.create({
      userId: payload.userId,
      title: payload.title,
      message: payload.message,
      channel: payload.channel || 'IN_APP',
      metadata: payload.metadata || {},
      status: 'SENT',
      sentAt: new Date(),
    } as any);

    return notification;
  }

  async findAll(userId: string, page = 1, limit = 20) {
    return notificationRepository.findByUser(userId, page, limit);
  }

  async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return notificationRepository.countUnread(userId);
  }
}

export const notificationService = new NotificationService();

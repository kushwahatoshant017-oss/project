import { alertRepository } from '@repositories/alert.repository';
import { ApiError } from '@utils/apiError';
import { weatherService } from './weather.service';
import { emailService } from './email.service';
import { notificationService } from './notification.service';
import logger from '@utils/logger';

export class AlertService {
  async create(userId: string, data: any) {
    return alertRepository.create({
      userId,
      locationLat: data.locationLat,
      locationLon: data.locationLon,
      locationName: data.locationName,
      alertType: data.alertType,
      condition: data.condition,
      thresholdValue: data.thresholdValue,
      unitSystem: data.unitSystem || 'METRIC',
      cooldownMinutes: data.cooldownMinutes || 60,
    } as any);
  }

  async findAll(userId: string) {
    return alertRepository.findByUser(userId);
  }

  async delete(id: string, userId: string) {
    const alert = await alertRepository.findByIdAndUser(id, userId);
    if (!alert) {
      throw ApiError.notFound('Alert not found');
    }
    return alertRepository.softDelete(id);
  }

  async checkAlerts(): Promise<void> {
    const alerts = await alertRepository.findAlertsNeedingCheck();
    const now = new Date();

    for (const alert of alerts) {
      try {
        const weather = await weatherService.getCurrentWeather(alert.locationLat, alert.locationLon);

        let currentValue: number;
        switch (alert.alertType) {
          case 'TEMPERATURE':
            currentValue = weather.temperature;
            break;
          case 'WIND':
            currentValue = weather.windSpeed;
            break;
          case 'PRECIPITATION':
            currentValue = weather.precipitation || 0;
            break;
          case 'UV_INDEX':
            currentValue = weather.uvIndex || 0;
            break;
          default:
            continue;
        }

        const shouldTrigger = this.evaluateCondition(currentValue, alert.condition, alert.thresholdValue);

        if (shouldTrigger) {
          const cooldownPassed = !alert.lastTriggeredAt ||
            (now.getTime() - alert.lastTriggeredAt.getTime()) > alert.cooldownMinutes * 60 * 1000;

          if (cooldownPassed) {
            await this.triggerAlert(alert, currentValue);
          }
        }
      } catch (error) {
        logger.error('Failed to check alert', { alertId: alert.id, error });
      }
    }
  }

  private evaluateCondition(currentValue: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'ABOVE': return currentValue > threshold;
      case 'BELOW': return currentValue < threshold;
      case 'EQUAL': return Math.abs(currentValue - threshold) < 0.01;
      case 'CHANGES_BY': return Math.abs(currentValue - threshold) > 0;
      default: return false;
    }
  }

  private async triggerAlert(alert: any, currentValue: number): Promise<void> {
    const title = `Weather Alert: ${alert.alertType}`;
    const message = `${alert.locationName || 'Your location'}: ${alert.alertType} is ${alert.condition} ${alert.thresholdValue} (Current: ${currentValue})`;

    try {
      await notificationService.send({
        userId: alert.userId,
        title,
        message,
        channel: 'IN_APP',
        metadata: { alertId: alert.id, currentValue, thresholdValue: alert.thresholdValue },
      });

      if (alert.user?.email) {
        await emailService.sendAlertNotification(alert.user.email, title, message);
      }

      await alertRepository.update(alert.id, { lastTriggeredAt: new Date() } as any);
    } catch (error) {
      logger.error('Failed to trigger alert notification', { alertId: alert.id, error });
    }
  }
}

export const alertService = new AlertService();

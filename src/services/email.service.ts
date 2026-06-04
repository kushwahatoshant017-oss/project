import nodemailer from 'nodemailer';
import config from '@config/index';
import { EmailOptions } from '@typings/index';
import logger from '@utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private initialized = false;

  private async init(): Promise<void> {
    if (this.initialized) return;

    if (config.smtp.user && config.smtp.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
    }

    this.initialized = true;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    await this.init();

    if (!this.transporter) {
      logger.warn('Email transport not configured. Skipping email send.');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: options.from || config.smtp.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      logger.info(`Email sent to ${options.to}`, { subject: options.subject });
    } catch (error) {
      logger.error('Failed to send email', { to: options.to, subject: options.subject, error });
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = `${config.cors.origin}/verify-email?token=${token}`;
    await this.sendEmail({
      to,
      subject: 'Verify your WeatherSphere account',
      html: `
        <h1>Welcome to WeatherSphere!</h1>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a>
        <p>This link expires in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = `${config.cors.origin}/reset-password?token=${token}`;
    await this.sendEmail({
      to,
      subject: 'Reset your WeatherSphere password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async sendAlertNotification(to: string, alertTitle: string, alertMessage: string): Promise<void> {
    await this.sendEmail({
      to,
      subject: `Weather Alert: ${alertTitle}`,
      html: `
        <h1>Weather Alert</h1>
        <h2>${alertTitle}</h2>
        <p>${alertMessage}</p>
        <p>View your alerts on WeatherSphere dashboard.</p>
      `,
    });
  }
}

export const emailService = new EmailService();

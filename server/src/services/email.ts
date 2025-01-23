import nodemailer from 'nodemailer';
import { CONFIG } from '../config/index.js';
import { logger } from '../config/logger.js';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
}

/**
 * @desc Email service for handling email operations
 */
class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * @desc Initialize email transporter
   */
  public async initialize(): Promise<boolean> {
    try {
      this.transporter = nodemailer.createTransport({
        host: CONFIG.EMAIL.HOST,
        port: CONFIG.EMAIL.PORT,
        secure: false,
        tls: {
          rejectUnauthorized: false // For development only
        }
      });

      // Verify connection
      await this.transporter.verify();
      
      this.isInitialized = true;
      logger.info('✅ Email service initialized');
      return true;
    } catch (error) {
      logger.error('❌ Email service initialization failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * @desc Send an email
   */
  public async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.transporter || !this.isInitialized) {
        throw new Error('Email service not initialized');
      }

      const mailOptions = {
        from: CONFIG.EMAIL.FROM,
        to: Array.isArray(options.to) ? options.to.join(',') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info('📧 Email sent successfully:', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return true;
    } catch (error) {
      logger.error('❌ Failed to send email:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: options.to,
        subject: options.subject,
      });
      return false;
    }
  }

  /**
   * @desc Send a test email
   */
  public async sendTestEmail(to: string): Promise<boolean> {
    return this.sendEmail({
      to,
      subject: 'Test Email',
      text: 'This is a test email from the application.',
      html: '<h1>Test Email</h1><p>This is a test email from the application.</p>',
    });
  }

  /**
   * @desc Close email transporter
   */
  public async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
      this.isInitialized = false;
      logger.info('📤 Email service closed');
    }
  }

  /**
   * @desc Check if email service is initialized
   */
  public isEmailServiceInitialized(): boolean {
    return this.isInitialized;
  }
}

export const emailService = EmailService.getInstance(); 
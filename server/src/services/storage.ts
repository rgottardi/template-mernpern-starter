import { S3Client, CreateBucketCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, _Object } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { CONFIG } from '../config/index.js';
import { logger } from '../config/logger.js';

interface UploadOptions {
  bucket: string;
  key: string;
  body: Buffer | Readable | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

interface DownloadOptions {
  bucket: string;
  key: string;
}

/**
 * @desc Storage service for managing S3 operations
 */
class StorageService {
  private static instance: StorageService;
  private client: S3Client | null = null;
  private isInitialized: boolean = false;
  private defaultBucket: string = 'default-bucket';

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * @desc Initialize S3 client and ensure default bucket exists
   */
  public async initialize(): Promise<boolean> {
    try {
      this.client = new S3Client({
        endpoint: CONFIG.AWS.ENDPOINT,
        region: CONFIG.AWS.REGION,
        credentials: {
          accessKeyId: CONFIG.AWS.ACCESS_KEY_ID,
          secretAccessKey: CONFIG.AWS.SECRET_ACCESS_KEY,
        },
        forcePathStyle: true, // Required for LocalStack
      });

      // Ensure default bucket exists
      await this.ensureDefaultBucket();
      
      this.isInitialized = true;
      logger.info('✅ Storage service initialized');
      return true;
    } catch (error) {
      logger.error('❌ Storage service initialization failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }

  /**
   * @desc Ensure default bucket exists
   */
  private async ensureDefaultBucket(): Promise<void> {
    try {
      await this.client!.send(new CreateBucketCommand({
        Bucket: this.defaultBucket,
      }));
      logger.info(`✅ Created default bucket: ${this.defaultBucket}`);
    } catch (error: any) {
      // Ignore if bucket already exists
      if (error.name !== 'BucketAlreadyExists' && error.name !== 'BucketAlreadyOwnedByYou') {
        throw error;
      }
    }
  }

  /**
   * @desc Upload file to S3
   */
  public async upload(options: UploadOptions): Promise<boolean> {
    try {
      if (!this.client || !this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const command = new PutObjectCommand({
        Bucket: options.bucket || this.defaultBucket,
        Key: options.key,
        Body: options.body,
        ContentType: options.contentType,
        Metadata: options.metadata,
      });

      await this.client.send(command);
      logger.info('📤 File uploaded successfully:', {
        bucket: options.bucket || this.defaultBucket,
        key: options.key,
      });
      return true;
    } catch (error) {
      logger.error('❌ File upload failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        bucket: options.bucket,
        key: options.key,
      });
      return false;
    }
  }

  /**
   * @desc Download file from S3
   */
  public async download(options: DownloadOptions): Promise<Buffer | null> {
    try {
      if (!this.client || !this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const command = new GetObjectCommand({
        Bucket: options.bucket || this.defaultBucket,
        Key: options.key,
      });

      const response = await this.client.send(command);
      if (!response.Body) {
        throw new Error('Empty response body');
      }

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      for await (const chunk of response.Body as Readable) {
        chunks.push(Buffer.from(chunk));
      }

      logger.info('📥 File downloaded successfully:', {
        bucket: options.bucket || this.defaultBucket,
        key: options.key,
      });
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('❌ File download failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        bucket: options.bucket,
        key: options.key,
      });
      return null;
    }
  }

  /**
   * @desc Generate pre-signed URL for direct upload/download
   */
  public async getSignedUrl(
    operation: 'upload' | 'download',
    options: DownloadOptions,
    expiresIn: number = 3600
  ): Promise<string | null> {
    try {
      if (!this.client || !this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const command = operation === 'upload'
        ? new PutObjectCommand({
            Bucket: options.bucket || this.defaultBucket,
            Key: options.key,
          })
        : new GetObjectCommand({
            Bucket: options.bucket || this.defaultBucket,
            Key: options.key,
          });

      const url = await getSignedUrl(this.client, command, { expiresIn });
      
      logger.info(`🔗 Generated ${operation} signed URL:`, {
        bucket: options.bucket || this.defaultBucket,
        key: options.key,
        expiresIn,
      });
      
      return url;
    } catch (error) {
      logger.error('❌ Failed to generate signed URL:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        operation,
        bucket: options.bucket,
        key: options.key,
      });
      return null;
    }
  }

  /**
   * @desc List objects in a bucket with optional prefix
   */
  public async listObjects(bucket?: string, prefix?: string): Promise<string[] | null> {
    try {
      if (!this.client || !this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const command = new ListObjectsV2Command({
        Bucket: bucket || this.defaultBucket,
        Prefix: prefix,
      });

      const response = await this.client.send(command);
      const objects = response.Contents?.map((obj: _Object) => obj.Key as string) || [];

      logger.info('📋 Listed objects successfully:', {
        bucket: bucket || this.defaultBucket,
        prefix: prefix || 'root',
        count: objects.length,
      });

      return objects;
    } catch (error) {
      logger.error('❌ Failed to list objects:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        bucket: bucket || this.defaultBucket,
        prefix,
      });
      return null;
    }
  }

  /**
   * @desc Delete object from S3
   */
  public async delete(options: DownloadOptions): Promise<boolean> {
    try {
      if (!this.client || !this.isInitialized) {
        throw new Error('Storage service not initialized');
      }

      const command = new DeleteObjectCommand({
        Bucket: options.bucket || this.defaultBucket,
        Key: options.key,
      });

      await this.client.send(command);
      
      logger.info('🗑️ Object deleted successfully:', {
        bucket: options.bucket || this.defaultBucket,
        key: options.key,
      });
      
      return true;
    } catch (error) {
      logger.error('❌ Failed to delete object:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        bucket: options.bucket,
        key: options.key,
      });
      return false;
    }
  }

  /**
   * @desc Check if storage service is initialized
   */
  public isStorageServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * @desc Get default bucket name
   */
  public getDefaultBucket(): string {
    return this.defaultBucket;
  }
}

export const storageService = StorageService.getInstance(); 
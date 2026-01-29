import mongoose from 'mongoose';
import { Logger } from '@shared/utils/logger';

export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      Logger.info('MongoDB already connected');
      return;
    }

    if (!uri) {
      throw new Error('MongoDB connection URI is required');
    }

    try {
      const options: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(uri, options);

      this.isConnected = true;
      Logger.info('MongoDB connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        Logger.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        Logger.info('MongoDB reconnected');
        this.isConnected = true;
      });

      // Handle process termination
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });
    } catch (error) {
      Logger.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      Logger.info('MongoDB disconnected');
    } catch (error) {
      Logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnection(): typeof mongoose {
    return mongoose;
  }
}

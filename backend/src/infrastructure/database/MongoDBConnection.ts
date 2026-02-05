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
        serverSelectionTimeoutMS: 10000, // Increased timeout for replica set discovery
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        retryReads: true,
        // Better handling for replica sets
        readPreference: 'primaryPreferred', // Prefer primary but allow secondary reads
        heartbeatFrequencyMS: 10000,
      };

      await mongoose.connect(uri, options);

      this.isConnected = true;
      Logger.info('MongoDB connected successfully', {
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      });

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        Logger.error('MongoDB connection error:', {
          message: error.message,
          name: error.name,
          readyState: mongoose.connection.readyState,
        });
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected', {
          readyState: mongoose.connection.readyState,
        });
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        Logger.info('MongoDB reconnected', {
          readyState: mongoose.connection.readyState,
        });
        this.isConnected = true;
      });

      mongoose.connection.on('connecting', () => {
        Logger.info('MongoDB connecting...');
      });

      mongoose.connection.on('connected', () => {
        Logger.info('MongoDB connected', {
          readyState: mongoose.connection.readyState,
        });
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
    // Check if connection is ready (1 = connected, 2 = connecting)
    const readyState = mongoose.connection.readyState;
    return readyState === 1 || readyState === 2;
  }

  /**
   * Ensure connection is active, reconnect if needed
   */
  async ensureConnection(): Promise<void> {
    const readyState = mongoose.connection.readyState;
    
    if (readyState === 1) {
      // Already connected
      return;
    }

    if (readyState === 0 || readyState === 99) {
      // Disconnected or uninitialized - try to reconnect
      Logger.warn('MongoDB connection lost, attempting to reconnect...', {
        readyState,
      });
      
      const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
      if (uri) {
        try {
          await this.connect(uri);
        } catch (error) {
          Logger.error('Failed to reconnect to MongoDB', error);
          throw error;
        }
      } else {
        throw new Error('MongoDB URI not available for reconnection');
      }
    }
  }

  getConnection(): typeof mongoose {
    return mongoose;
  }
}

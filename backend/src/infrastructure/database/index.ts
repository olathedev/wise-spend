import { MongoDBConnection } from './MongoDBConnection';

let dbConnection: MongoDBConnection | null = null;

export const initializeDatabase = async (): Promise<void> => {
  const connectionString =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'MongoDB connection string is required. Set MONGODB_URI, MONGO_URI, or DATABASE_URL in your .env file'
    );
  }

  dbConnection = MongoDBConnection.getInstance();
  await dbConnection.connect(connectionString);
};

export const getDatabase = (): MongoDBConnection => {
  if (!dbConnection) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbConnection;
};

export { MongoDBConnection } from './MongoDBConnection';

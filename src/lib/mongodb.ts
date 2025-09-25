import { connect, Connection, ConnectOptions } from 'mongoose';
import { config } from '@/config';

// Use the same database URL pattern as trumarket project
const DATABASE_URL = config.databaseUrl;

if (!DATABASE_URL) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    var mongoose: any;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async (
    uri: string = DATABASE_URL,
    options?: ConnectOptions,
): Promise<Connection> => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            ...options,
        };

        cached.promise = connect(uri, opts).then((mongoose) => {
            return mongoose.connection;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

// Default export for backward compatibility
export default connectDB;

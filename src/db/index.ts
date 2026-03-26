import mongoose from 'mongoose';
import serverConfig from '../config/server-config';
import logger from '../config/logger-config';

export async function connectToDB(): Promise<void> {
    try {
        const connectionInstance = await mongoose.connect(serverConfig.DATABASE_URL);

        logger.info({ host: connectionInstance.connection.host }, 'MongoDB Connected Successfully');
    } catch (error: any) {
        logger.error({ error: error.message }, 'MongoDB Connection Failed');
        throw error;
    }
}

export async function closeDBConnection(): Promise<void> {
    try {
        await mongoose.connection.close();

        logger.info('MongoDB Connection Closed Gracefully');
    } catch (error: any) {
        logger.error({ error: error.message }, 'Error closing MongoDB Connection');
    }
}

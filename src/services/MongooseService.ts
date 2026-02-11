import mongoose from 'mongoose';
import ConfigModel from '../models/ConfigModel.js';

mongoose.connection.on('connected', async () => {
    console.log("[Database] Successfully connected !");
    const config = await ConfigModel.findOne();
    if (!config) {
        console.log("[Database] No config found, creating default config...");
        await ConfigModel.create({});
    }
});

mongoose.connection.on('error', () =>
    console.error('[Database] Failed to connect on the database.')
);

export const connectDb = async(MONGODB_USERNAME : string, MONGODB_PASSWORD : string, MONGODB_URL : string) => {
    let mongoURI = `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${MONGODB_URL}:27017`;
    console.log('[Database] Connecting to database..');
    await mongoose.connect(mongoURI, {dbName: "cacahuet"});
}
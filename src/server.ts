import http from 'http';
import https from 'https';
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cron from 'node-cron';
import cors from 'cors';
import fs from 'fs';

dotenv.config();

import router from './routes/index.js';
import { connectDb } from './services/MongooseService.js';
import { resetPlayer } from './services/cron/resetUser.js';


let httpsOptions: https.ServerOptions | null = null;

if (!process.env.PATH_KEY_HTTPS || !process.env.PATH_CERF_HTTPS) {
	console.error("No Https certificates")
} else {
	httpsOptions = {
		key: fs.readFileSync(process.env.PATH_KEY_HTTPS),
		cert: fs.readFileSync(process.env.PATH_CERF_HTTPS)
	};
}

(async () => {
	const app = express();

	app.disable('X-Powered-By');
	app.use(express.json());
	app.use(bodyParser.json({ type: 'application/*+json' }))

	app.use(cors());

	app.use('/api', router);

	const server: http.Server = http.createServer(app);
	server.listen(process.env.PORT_HTTP, () => {
		console.log(`HTTP Port : ${process.env.PORT_HTTP}`);
	})

	if (httpsOptions)
	{
		const securedServer = https.createServer(httpsOptions, app);

		securedServer.listen(process.env.PORT_HTTPS, () => {
			console.log(`HTTPS Port : ${process.env.PORT_HTTPS}`);
		});	
	}

	if (!process.env.JWT_SECRET)
		throw new Error('Missing JWT secret environment variable');
	if (!process.env.SALT_ROUNDS)
		throw new Error('Missing SALT_ROUNDS environment variable');
	if (!process.env.MONGODB_USERNAME || !process.env.MONGODB_PASSWORD || !process.env.MONGODB_URL)
        throw new Error('Missing required MongoDB environment variables');

    await connectDb(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD, process.env.MONGODB_URL);

	cron.schedule('42 23 * * 0', async () => {
        await resetPlayer();
    });
})();
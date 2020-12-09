import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import dynamo from './dynamo/dynamo';
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();

async function start() {
    await dynamo.createTables();
}

start();

app.use(bodyParser.json());

app.use(cors({
    origin: process.env.CLIENT_URL
}))

app.use('/api', router);

app.listen(parseInt(process.env.PORT as string) || 8080);
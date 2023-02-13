import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { ResponseLogger } from './middleware';

import campaign from '@campaign/index';

const app = express();

//* Middleware //
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(ResponseLogger);

//* Router //
app.get('/', (_, res) => res.send('GoodPeople API Server.')); // Health Check

// campaign
app.use('/api/v1/campaign', campaign);

export { app };

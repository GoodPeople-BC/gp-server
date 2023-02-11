import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import { ResponseLogger } from './middleware';

import donation from '@donation/index';

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

// donation
app.use('/api/v1/donation', donation);

export { app };

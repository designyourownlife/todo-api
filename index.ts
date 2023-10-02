import express, { Express } from 'express';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Task } from './src/tasks/tasks.entity';
import { tasksRouter } from './src/tasks/tasks.router';

// instantiate express app
const app: Express = express();
dotenv.config();

// parse request body
app.use(bodyParser.json());

// use CORS install types as well
app.use(cors());

const dbPort: number = process.env.DATABASE_PORT
  ? parseInt(process.env.DATABASE_PORT)
  : 3306;

// Create database connection
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: dbPort,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [Task],
  synchronize: true,
});

// define server port
const port = process.env.PORT;

AppDataSource.initialize()
  .then(() => {
    // start listening to the request on the defined port
    app.listen(port);
    console.log('Data source has been initialized!');
  })
  .catch((err) => {
    console.error(
      'Error during data source initialization',
      err,
    );
  });

app.use('/', tasksRouter);

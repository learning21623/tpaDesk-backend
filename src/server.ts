import 'reflect-metadata';
import express from 'express';
import { useContainer, useExpressServer } from 'routing-controllers';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { Container } from 'typedi';
import config from './config/config';
import AppDataSource from './config/dbconfig';
import dotenv from 'dotenv';

dotenv.config();

async function start() {
  try {
    await AppDataSource.initialize();
    console.log('Postgres Database Connected Successfully');

    const app = express();

    // Middleware before controller setup
    app.use(helmet());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(morgan('tiny'));

    // Static file serving (e.g., uploaded images)
    console.log(path.join(__dirname, '../appData/img'));
    app.use('/images', express.static(path.join(__dirname, '../appData/img')));

    useContainer(Container);

    // Set up controller-based routes with CORS enabled
    useExpressServer(app, {
      cors: config.corsOptions,
      controllers: [path.join(__dirname, '/controllers/v*/*Controller.{ts,js}')],
      middlewares: [path.join(__dirname, '/middleware/*.{ts,js}')],
    });



    app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

start();

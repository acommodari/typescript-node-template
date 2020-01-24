import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';

import logger from './loaders/logger';
import config from './config';

const app = express();

app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message);
      }
    }
  })
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(config.port, err => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }

  logger.info(`Server listening on port: ${config.port}`);
});

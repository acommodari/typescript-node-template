import winston from 'winston';
import config from '../config';

const formatTemplate = info => {
  const { timestamp, level, message } = info;
  return `${timestamp} ${level}: ${message}`;
};

let logger;

if (process.env.NODE_ENV != 'production') {
  logger = winston.createLogger({
    level: config.logs.level,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.align(),
      winston.format.printf(formatTemplate)
    ),
    transports: [new winston.transports.Console()]
  });
} else {
  logger = winston.createLogger({
    level: config.logs.level,
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.json(),
      winston.format.printf(formatTemplate)
    ),
    transports: [
      new winston.transports.File({
        filename: '../../logs/error.log',
        level: 'error',
        handleExceptions: true,
        maxsize: 5242880, //5MB
        maxFiles: 5
      }),
      new winston.transports.File({
        filename: '../../logs/all.log',
        handleExceptions: true,
        maxsize: 5242880, //5MB
        maxFiles: 5
      })
    ],
    exitOnError: false
  });
}

logger.stream = {
  write: (message: string) => {
    logger.info(message);
  }
};

export default logger;

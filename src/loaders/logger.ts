import winston from 'winston';
import config from '../config';

const formatTemplate = info => {
  const { timestamp, level, message } = info;
  return `${timestamp} ${level}: ${message}`;
};

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.align(),
  winston.format.printf(formatTemplate)
);

const devTransports = [new winston.transports.Console()];

const prodFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.json(),
  winston.format.printf(formatTemplate)
);

const prodTransports = [
  new winston.transports.File({
    filename: '../../logs/error.log',
    level: 'error',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  new winston.transports.File({
    filename: '../../logs/all.log',
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

const format = process.env.NODE_ENV !== 'production' ? devFormat : prodFormat;

const transports = process.env.NODE_ENV !== 'production' ? devTransports : prodTransports;

const logger = winston.createLogger({
  level: config.logs.level,
  format,
  transports,
  exitOnError: false
});

export default logger;

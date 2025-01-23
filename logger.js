const winston = require("winston");
require("winston-daily-rotate-file");

// Configure log rotation
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  dirname: "./logs", 
  filename: "application-%DATE%.log", 
  datePattern: "YYYY-MM-DD", 
  maxFiles: "7d", 
  level: "info", 
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(), 
    dailyRotateFileTransport, 
  ],
});

const info = (message) => {
  logger.info(`${new Date().toLocaleString()} ${message}`);
};

const error = (message) => {
  logger.error(`${new Date().toLocaleString()} ${message}`);
};

module.exports = {
  info: info,
  error: error,
};

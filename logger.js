const winston = require("winston");
const Date = new Date();
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const info = (message) => {
  logger.info(`${Date.toLocaleDateString()} message: ${message}`);
};

const error = (message) => {
  logger.error(`${Date.toLocaleDateString()} message: ${message}`);
};

module.exports = {
  info: info,
  error: error,
};

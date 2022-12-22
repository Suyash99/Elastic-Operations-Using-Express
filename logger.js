const winston = require("winston");
const date = new Date();
const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

const info = (message) => {
  logger.info(`${date.toDateString()} ${message}`);
};

const error = (message) => {
  logger.error(`${date.toLocaleDateString()} ${message}`);
};

module.exports = {
  info: info,
  error: error,
};

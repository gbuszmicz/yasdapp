var winston = require('winston');
var env = process.env.NODE_ENV || 'development';
winston.emitErrs = true;

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: (env === 'development') ? 'debug' : 'info',
      handleExceptions: true,
			json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

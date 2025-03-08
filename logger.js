const winston = require('winston');
const config = require('./config');
let options = config.get('app.logger');

let transports = [new winston.transports.Console()];
for (let i in options.transports) {
    transports.push(new winston.transports.File(options.transports[i]));
}

const logger = winston.createLogger({
    level: options.level,
    silent: options.silent,
    format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: transports,
});

module.exports = logger;
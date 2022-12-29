const { createLogger, transports, format } = require("winston");

const loggingLevels = {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
}

const logger = createLogger({
    levels: loggingLevels,
    level: 'debug',
    format: format.json(),
    transports: [new transports.Console()],
});

module.exports = logger;
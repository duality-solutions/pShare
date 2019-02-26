import * as path from 'path'
import { app } from 'electron';
import winston, { createLogger } from 'winston';
import * as fs from 'fs'
import { createPromiseResolver } from '../../shared/system/createPromiseResolver';

const loggerProm = _createLogger();



export const getLogger = () => loggerProm

async function _createLogger() {
    const logPath = path.join(app.getPath("home"), ".pshare", "logs", "pshare.log");
    const resolver = createPromiseResolver<void>();
    fs.unlink(logPath, (err) => {
        if (err) {
            resolver.reject(err);
        }
        else {
            resolver.resolve();
        }
    });
    try {
        await resolver.promise;
    }
    catch { }
    const logger = createLogger({ transports: new winston.transports.File({ filename: logPath }) });
    return logger;
}

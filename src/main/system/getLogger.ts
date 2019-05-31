import * as path from 'path'
import { app } from 'electron';
import winston, { createLogger } from 'winston';
import * as fs from 'fs'
import { createPromiseResolver } from '../../shared/system/createPromiseResolver';

const isDevelopment = process.env.NODE_ENV === 'development'

let loggerProm: Promise<winston.Logger | undefined>;



export const getLogger = () => {
    if (!loggerProm) {
        loggerProm = isDevelopment ? Promise.resolve(undefined as winston.Logger | undefined) : _createLogger()
    }
    return loggerProm;
}

async function _createLogger() {
    const logPath = path.join(app.getPath("home"), ".pShare", "logs", "pShare.log");
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

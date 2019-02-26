import { prepareErrorForSerialization } from '../../shared/proxy/prepareErrorForSerialization';
import winston from 'winston';
export function divertConsoleToLogger(logger: winston.Logger) {
  const originalConsoleLog = console.log.bind(console);
  const originalConsoleWarn = console.warn.bind(console);
  const originalConsoleInfo = console.info.bind(console);
  const originalConsoleError = console.error.bind(console);
  console.log = (...args: any) => {
    logger.info(["Main console", ...args]);
    originalConsoleLog(...args);
  };
  console.warn = (...args: any) => {
    logger.warn(["Main console", ...args]);
    originalConsoleWarn(...args);
  };
  console.info = (...args: any) => {
    logger.info(["Main console", ...args]);
    originalConsoleInfo(...args);
  };
  console.error = (...args: any) => {
    logger.error(["Main console", ...args]);
    originalConsoleError(...args);
  };
  process.on('uncaughtException', (err) => {
    const e = prepareErrorForSerialization(err);
    logger.error("Main console", e);
    originalConsoleError(e);
  });
}

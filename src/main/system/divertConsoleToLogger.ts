import { prepareErrorForSerialization } from '../../shared/proxy/prepareErrorForSerialization';
import { getLogger } from './getLogger';
export async function divertConsoleToLogger() {
  const logger = await getLogger()
  if (typeof logger === 'undefined') {
    return
  }
  const originalConsoleLog = console.log.bind(console);
  const originalConsoleWarn = console.warn.bind(console);
  const originalConsoleInfo = console.info.bind(console);
  const originalConsoleError = console.error.bind(console);
  console.log = (...args: any) => {
    const timestamp = new Date().toUTCString()
    logger.info(["Main console", timestamp, ...args]);
    originalConsoleLog(...args);
  };
  console.warn = (...args: any) => {
    const timestamp = new Date().toUTCString()
    logger.warn(["Main console", timestamp, ...args]);
    originalConsoleWarn(...args);
  };
  console.info = (...args: any) => {
    const timestamp = new Date().toUTCString()
    logger.info(["Main console", timestamp, ...args]);
    originalConsoleInfo(...args);
  };
  console.error = (...args: any) => {
    const timestamp = new Date().toUTCString()
    logger.error(["Main console", timestamp, ...args]);
    originalConsoleError(...args);
  };
  process.on('uncaughtException', (err) => {
    const e = prepareErrorForSerialization(err);
    logger.error("Main console", e);
    originalConsoleError(e);
  });
}

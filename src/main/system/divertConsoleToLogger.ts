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
    let flag = false
    args.map((item:string) => {
      if (item && typeof item === 'string' && 
         (item.includes('password') || item.includes('PASSWORD') || item.includes('PASSPHRASE') ))
        flag = true;
    })
    originalConsoleLog(...args);
    if(flag) return;
    logger.info(["Main console", timestamp, ...args]);
  };
  console.warn = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:string) => {
      if (item && typeof item === 'string' && 
         (item.includes('password') || item.includes('PASSWORD') || item.includes('PASSPHRASE') ))
        flag = true;
    })
    originalConsoleWarn(...args);
    if(flag) return;
    logger.warn(["Main console", timestamp, ...args]);
  };
  console.info = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:string) => {
      if (item && typeof item === 'string' && 
         (item.includes('password') || item.includes('PASSWORD') || item.includes('PASSPHRASE') ))
        flag = true;
    })
    originalConsoleInfo(...args);
    if(flag) return;
    logger.info(["Main console", timestamp, ...args]);
  };
  console.error = (...args: any) => {
    const timestamp = new Date().toUTCString()
    let flag = false
    args.map((item:string) => {
      if (item && typeof item === 'string' && 
         (item.includes('password') || item.includes('PASSWORD') || item.includes('PASSPHRASE') ))
        flag = true;
    })
    originalConsoleError(...args);
    if(flag) return;
    logger.error(["Main console", timestamp, ...args]);
  };
  process.on('uncaughtException', (err) => {
    const e = prepareErrorForSerialization(err);
    logger.error("Main console", e);
    originalConsoleError(e);
  });
}
